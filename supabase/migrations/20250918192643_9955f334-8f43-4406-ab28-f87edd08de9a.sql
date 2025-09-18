-- Fix search_path security issue for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Only create profile if role is specified in metadata
  IF NEW.raw_user_meta_data ? 'role' THEN
    INSERT INTO public.profiles (user_id, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'role');
  END IF;
  RETURN NEW;
END;
$$;