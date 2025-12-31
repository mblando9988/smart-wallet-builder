-- Create table for storing user spend permissions
CREATE TABLE public.spend_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  spender_address TEXT NOT NULL,
  token_address TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 8453,
  allowance_usdc NUMERIC NOT NULL,
  period_days INTEGER NOT NULL DEFAULT 1,
  permission_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create index for quick lookups
CREATE INDEX idx_spend_permissions_user ON public.spend_permissions(user_address);
CREATE INDEX idx_spend_permissions_active ON public.spend_permissions(user_address, is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.spend_permissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (wallet-based auth, not session-based)
CREATE POLICY "Anyone can create spend permissions" 
ON public.spend_permissions 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read their own permissions by address
CREATE POLICY "Users can view their own permissions" 
ON public.spend_permissions 
FOR SELECT 
USING (true);

-- Allow updates to own permissions
CREATE POLICY "Users can update their own permissions" 
ON public.spend_permissions 
FOR UPDATE 
USING (true);

-- Create table for storing agent server wallet info
CREATE TABLE public.agent_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id TEXT UNIQUE NOT NULL,
  smart_account_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_wallets ENABLE ROW LEVEL SECURITY;

-- Allow read access for all (needed for spend permission setup)
CREATE POLICY "Anyone can view agent wallets" 
ON public.agent_wallets 
FOR SELECT 
USING (true);

-- Create table for chat history
CREATE TABLE public.agent_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_address TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tool_calls JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for chat history lookups
CREATE INDEX idx_agent_chat_user ON public.agent_chat_messages(user_address);

-- Enable RLS
ALTER TABLE public.agent_chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert chat messages
CREATE POLICY "Anyone can create chat messages" 
ON public.agent_chat_messages 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to read chat messages (filtered by address in code)
CREATE POLICY "Anyone can view chat messages" 
ON public.agent_chat_messages 
FOR SELECT 
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for spend_permissions
CREATE TRIGGER update_spend_permissions_updated_at
BEFORE UPDATE ON public.spend_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();