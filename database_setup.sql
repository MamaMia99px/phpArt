-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create profiles table to store additional user information
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status order_status NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'cod',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE cart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products: Everyone can view products, only owners can edit
CREATE POLICY "Products are viewable by everyone."
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own products."
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products."
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own products."
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Orders: Users can view and manage their own orders
CREATE POLICY "Users can view their own orders."
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders."
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders."
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Order Items: Users can view and manage their own order items
CREATE POLICY "Users can view their own order items."
  ON order_items FOR SELECT
  USING ((SELECT user_id FROM orders WHERE id = order_id) = auth.uid());

CREATE POLICY "Users can insert their own order items."
  ON order_items FOR INSERT
  WITH CHECK ((SELECT user_id FROM orders WHERE id = order_id) = auth.uid());

-- Cart: Users can manage their own cart
CREATE POLICY "Users can view their own cart."
  ON cart FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own cart."
  ON cart FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own cart."
  ON cart FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own cart."
  ON cart FOR DELETE
  USING (user_id = auth.uid());

-- Cart Items: Users can manage their own cart items
CREATE POLICY "Users can view their own cart items."
  ON cart_items FOR SELECT
  USING ((SELECT user_id FROM cart WHERE id = cart_id) = auth.uid());

CREATE POLICY "Users can insert their own cart items."
  ON cart_items FOR INSERT
  WITH CHECK ((SELECT user_id FROM cart WHERE id = cart_id) = auth.uid());

CREATE POLICY "Users can update their own cart items."
  ON cart_items FOR UPDATE
  USING ((SELECT user_id FROM cart WHERE id = cart_id) = auth.uid());

CREATE POLICY "Users can delete their own cart items."
  ON cart_items FOR DELETE
  USING ((SELECT user_id FROM cart WHERE id = cart_id) = auth.uid());

-- Enable realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE cart;
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;

-- Create trigger to update profiles when users are created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', NULL);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create trigger to create cart when users are created
CREATE OR REPLACE FUNCTION public.handle_new_user_cart()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.cart (user_id)
  VALUES (new.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_cart
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_cart();
