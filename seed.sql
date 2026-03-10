
-- 1. Create Admin User
DO $$
DECLARE
  new_admin_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@chocodash.ec') THEN
    INSERT INTO auth.users (
      id, aud, role, email, raw_user_meta_data, encrypted_password, email_confirmed_at, created_at, updated_at, app_metadata
    ) VALUES (
      new_admin_id,
      'authenticated',
      'authenticated',
      'admin@chocodash.ec',
      '{"full_name":"Administrador ChocoDash"}',
      crypt('chocopassword123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'
    );
    
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      new_admin_id,
      format('{"sub":"%s","email":"%s"}', new_admin_id::text, 'admin@chocodash.ec')::jsonb,
      'email',
      new_admin_id,
      now(),
      now(),
      now()
    );
  END IF;
END $$;

-- 2. Inserción de Inventario Base
INSERT INTO inventarios (id, nombre, periodo_inicio, periodo_fin, es_activo, precio_kwh) VALUES (
  'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Inventario Base 2025', '2025-01-01', '2025-12-31', true, 0.089
) ON CONFLICT DO NOTHING;

-- 3. Productos
INSERT INTO productos (id, nombre, linea, activo) VALUES ('b5bd945d-2e66-4c0c-94bd-1363703c052c', 'Cacao Puro 100%', 'clasica', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('b5e53aaa-cf15-4476-8bfb-7180454eff65', 'Oscuro Intenso 85%', 'clasica', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('f5ec1914-7d94-4be3-bd6b-e4c01718f0f8', 'Oscuro Equilibrado 70%', 'clasica', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('cd5fb29d-e66d-412d-9532-6a747db715a4', 'Con Leche Clásico', 'clasica', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('7b32f113-c2e9-43f3-a528-6a502e824b16', 'Chocolate Blanco Suave', 'clasica', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('65654124-7cd9-46d3-9ca6-62b79faba740', 'Caramelo Salado', 'clasica', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('2839750c-1162-4b33-9656-92ca89f9f7c8', 'Maracuyá Explosivo', 'premium', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('2ec0e54e-1cb3-4d9d-8645-705578dacbf8', 'Guanábana & Blanco', 'premium', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('391c0860-bb6a-4c66-8bea-24c372f0e180', 'Naranjilla Andina', 'premium', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('01d33ad8-a84d-4ebb-9d11-2002b96fc40d', 'Taxo & Pimienta Rosa', 'premium', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('03f7c73d-6177-455b-ab17-06ed17e0332c', 'Toronjil Místico', 'premium', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('c63e8c37-1c7d-4b55-8ea2-c8fd1b8c1a89', 'Passionfruit Dreams', 'premium', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('b5d54afa-5017-4632-8064-666bf7336c11', 'Fresa Explosiva ⭐', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('bf801dda-b4f9-4810-8a18-3d431a944281', 'Peanut Butter Crunch ⭐', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('f20ebf53-29e4-4d66-966f-dc04f569b508', 'Dubai Style ⭐', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('cbd41beb-7560-4e47-a653-985407daca39', 'Coco Crocante Blanco', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('e7b23059-3f7a-4432-ac2a-16c0fc5a22d4', 'Brownie en Barra', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('89cb0e30-924d-4ca1-bc45-f9fe34fd1e79', 'S''mores Ecuatoriano', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('8f09d2de-78cc-4404-94d2-ce002a9404cb', 'Mango Biche & Ají', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('3fc22a99-99d8-4c53-a9f3-b404b7adefe1', 'Chips Crocante Oscuro', 'especial', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('eed9a72c-9cf5-4324-bef7-fd7f80628831', 'Sin Azúcar Stevia', 'saludable', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('768fa476-f87a-4afe-b388-4288c1a590ba', 'Proteico Quinua', 'saludable', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('b31a973f-ba94-4ea5-8ec7-1787a531a998', 'Granola Andina Choco', 'saludable', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('217df109-2195-421d-a150-b28b9ff36394', 'Oscuro Cero Azúcar', 'saludable', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('fa51cbc0-6b14-451c-930f-1dc55ea9f1c6', 'Crema Choco Clásica', 'formato', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('5a2edd10-2f63-4472-baca-aee18f6696bf', 'Paleta Chocolateada', 'formato', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('968e5d81-c94b-44b1-af30-bb48c05c64bf', 'Bombones Gift Box', 'formato', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('5d49d570-54a9-4cf9-a57a-56a75cd5c5e1', 'Cacao en Polvo', 'formato', true) ON CONFLICT DO NOTHING;
INSERT INTO productos (id, nombre, linea, activo) VALUES ('f5d4f192-0fde-49ed-a779-64fc7988760d', 'Kit Regalo Surtido', 'formato', true) ON CONFLICT DO NOTHING;

-- 4. Recetas
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a14d5e95-fb30-4208-9053-a7cecace4002', 'b5bd945d-2e66-4c0c-94bd-1363703c052c', 'Pasta/licor de cacao', 0.07, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('23b056ae-024c-4a43-a401-af12019c8eef', 'b5bd945d-2e66-4c0c-94bd-1363703c052c', 'Manteca de cacao', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('934985cf-da73-4e6b-90b1-77816c33c172', 'b5bd945d-2e66-4c0c-94bd-1363703c052c', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('cc64d3d4-b986-4fe7-87dc-666e2d225a32', 'b5e53aaa-cf15-4476-8bfb-7180454eff65', 'Pasta/licor de cacao', 0.055, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('7d9129f6-e625-4fa7-ba3d-ef5180610f34', 'b5e53aaa-cf15-4476-8bfb-7180454eff65', 'Manteca de cacao', 0.012, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('8f082348-d3a0-4570-bbaf-b0e412f84599', 'b5e53aaa-cf15-4476-8bfb-7180454eff65', 'Azúcar blanca', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('d30a15c3-aa9f-4c19-85aa-8d3ae2ff2684', 'b5e53aaa-cf15-4476-8bfb-7180454eff65', 'Vainilla extracto natural', 0.001, 'litro') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('45b30f96-2f2f-4f86-a13f-1ab8ba1bc3c1', 'b5e53aaa-cf15-4476-8bfb-7180454eff65', 'Lecitina de soya', 0.002, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('08b154d3-451f-43f7-aa88-892fcdb7b29b', 'b5e53aaa-cf15-4476-8bfb-7180454eff65', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('98c928ba-8ec7-46d1-810d-7897df2d0447', 'f5ec1914-7d94-4be3-bd6b-e4c01718f0f8', 'Pasta/licor de cacao', 0.04, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('db7dd878-7fb9-4538-86cc-7800b46cbc53', 'f5ec1914-7d94-4be3-bd6b-e4c01718f0f8', 'Manteca de cacao', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('4fd3722e-af0d-4dd1-8e38-9038b5386f3a', 'f5ec1914-7d94-4be3-bd6b-e4c01718f0f8', 'Azúcar blanca', 0.02, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('88c20822-3b02-4c8a-a881-f506ee4b7dff', 'f5ec1914-7d94-4be3-bd6b-e4c01718f0f8', 'Lecitina de soya', 0.002, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('dc36beb9-a217-426f-9f1a-b4c0da65de72', 'f5ec1914-7d94-4be3-bd6b-e4c01718f0f8', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('63027d38-4955-4c99-8370-8b80010a8088', 'cd5fb29d-e66d-412d-9532-6a747db715a4', 'Pasta/licor de cacao', 0.025, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('771ea12c-3fbe-4453-990d-4bebd36fd9b8', 'cd5fb29d-e66d-412d-9532-6a747db715a4', 'Manteca de cacao', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('b342b513-5e40-4597-886f-a67683e1a780', 'cd5fb29d-e66d-412d-9532-6a747db715a4', 'Azúcar blanca', 0.025, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('cbb3f568-c78c-4381-ad4a-287c58e97c5e', 'cd5fb29d-e66d-412d-9532-6a747db715a4', 'Leche en polvo', 0.012, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('209fa5dd-2081-4f7e-8206-7e43a3330777', 'cd5fb29d-e66d-412d-9532-6a747db715a4', 'Lecitina de soya', 0.002, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('d116331e-a847-4540-bffb-b5b2d28da902', 'cd5fb29d-e66d-412d-9532-6a747db715a4', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a92b7907-019d-474e-8dcd-2805c7f051da', '7b32f113-c2e9-43f3-a528-6a502e824b16', 'Manteca de cacao', 0.025, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('f7e4dbf1-9039-4dd4-acce-42d1c4d40a6e', '7b32f113-c2e9-43f3-a528-6a502e824b16', 'Azúcar blanca', 0.02, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a866e76d-5920-4961-8cce-1a1401063d13', '7b32f113-c2e9-43f3-a528-6a502e824b16', 'Leche en polvo', 0.012, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('63ab5bd4-fbb4-4ee0-b9ae-46367e2112ac', '7b32f113-c2e9-43f3-a528-6a502e824b16', 'Vainilla extracto natural', 0.001, 'litro') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('0f850046-aa97-4f03-a0d1-30da8ec82d07', '7b32f113-c2e9-43f3-a528-6a502e824b16', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('ea23abf5-9e26-46ef-a2a3-ce800f68d9c9', '65654124-7cd9-46d3-9ca6-62b79faba740', 'Pasta/licor de cacao', 0.02, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('29678329-9a48-4adc-90f8-7c8175baf1b6', '65654124-7cd9-46d3-9ca6-62b79faba740', 'Manteca de cacao', 0.012, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('3c4caf45-a32c-41b2-adfe-7e58ed875e80', '65654124-7cd9-46d3-9ca6-62b79faba740', 'Azúcar blanca', 0.02, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('c07db9ff-d943-41ee-ab4e-f4ae9a360b40', '65654124-7cd9-46d3-9ca6-62b79faba740', 'Leche en polvo', 0.008, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('c7a9f99f-9e83-42e9-ae00-eb263116dbf2', '65654124-7cd9-46d3-9ca6-62b79faba740', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('291251b6-4c7a-4036-8341-77013edd26e0', '2839750c-1162-4b33-9656-92ca89f9f7c8', 'Pasta/licor de cacao', 0.035, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('e277d328-0f1a-4519-8b9f-461c7fc2b064', '2839750c-1162-4b33-9656-92ca89f9f7c8', 'Manteca de cacao', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('b1f8792c-029b-409c-b53b-17aa9f6066a1', '2839750c-1162-4b33-9656-92ca89f9f7c8', 'Azúcar blanca', 0.012, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a1d4c65d-78d1-40a5-8b6c-e4ec6531e628', '2839750c-1162-4b33-9656-92ca89f9f7c8', 'Maracuyá pulpa congelada', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a958b2e4-3b53-44a6-8431-93fa9b1b2812', '2839750c-1162-4b33-9656-92ca89f9f7c8', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a70bc2ac-9594-4a5d-a35e-6b544492f09d', 'f20ebf53-29e4-4d66-966f-dc04f569b508', 'Pasta/licor de cacao', 0.025, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('c0209578-3b60-477c-8d79-8811be57b8ce', 'f20ebf53-29e4-4d66-966f-dc04f569b508', 'Manteca de cacao', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('b5e438e6-bd6c-43c4-89e7-933c48599686', 'f20ebf53-29e4-4d66-966f-dc04f569b508', 'Leche en polvo', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('27512ea2-466c-4338-9c76-c9326728e2bc', 'f20ebf53-29e4-4d66-966f-dc04f569b508', 'Pistacho pelado', 0.02, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('7b738b67-cc1a-451c-a4da-4ce259bb83fd', 'f20ebf53-29e4-4d66-966f-dc04f569b508', 'Kataifi (fideos crujientes)', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('d7076a3f-f18a-4d64-ad82-2c097c7a723d', 'f20ebf53-29e4-4d66-966f-dc04f569b508', 'Tahini (pasta de sésamo)', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('272f1ed3-0bc0-4b53-bfed-54d5e2ef66d1', 'f20ebf53-29e4-4d66-966f-dc04f569b508', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('b96657b2-b212-46ca-94a4-4461f73aa183', 'b5d54afa-5017-4632-8064-666bf7336c11', 'Pasta/licor de cacao', 0.022, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('0de99036-67df-4738-ad56-d15096490aff', 'b5d54afa-5017-4632-8064-666bf7336c11', 'Manteca de cacao', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('f96baf19-290e-4819-810f-c32425a0039d', 'b5d54afa-5017-4632-8064-666bf7336c11', 'Leche en polvo', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('31fdbc0b-88fc-4515-a6d1-b1aa04c38933', 'b5d54afa-5017-4632-8064-666bf7336c11', 'Fresa liofilizada', 0.008, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('ba20a8a3-6390-4549-a0ce-c395eaeb758f', 'b5d54afa-5017-4632-8064-666bf7336c11', 'Pop rocks comestibles', 0.005, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('51ed53b3-7911-4749-9a0e-e81c4ef09c38', 'b5d54afa-5017-4632-8064-666bf7336c11', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a013781b-22d3-435c-958c-b954c77a6cba', 'bf801dda-b4f9-4810-8a18-3d431a944281', 'Pasta/licor de cacao', 0.035, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('725753c0-918b-4b81-a2f1-25d70584979a', 'bf801dda-b4f9-4810-8a18-3d431a944281', 'Manteca de cacao', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('42f64ae3-3ef3-4f3d-a7d6-fa6bc57b4d1c', 'bf801dda-b4f9-4810-8a18-3d431a944281', 'Maní / mantequilla de maní', 0.02, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('eb4451b0-f51b-48e5-99e8-79571d21603f', 'bf801dda-b4f9-4810-8a18-3d431a944281', 'Azúcar blanca', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('1eed5740-4376-44bb-aa17-4a5d130b849c', 'bf801dda-b4f9-4810-8a18-3d431a944281', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('c7a2f5df-27de-4304-85c7-2040453c347f', 'cbd41beb-7560-4e47-a653-985407daca39', 'Manteca de cacao', 0.02, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('01de19b0-f639-42fb-9594-b80c6d690e42', 'cbd41beb-7560-4e47-a653-985407daca39', 'Azúcar blanca', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('c5259779-a2eb-44b7-b1f7-9b3d0b8d85d8', 'cbd41beb-7560-4e47-a653-985407daca39', 'Leche en polvo', 0.01, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('312762a5-a7d3-45fe-865d-c7fd7a21efa8', 'cbd41beb-7560-4e47-a653-985407daca39', 'Coco rallado tostado', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('fd6445fb-b475-426b-b565-46dad189f8d7', 'cbd41beb-7560-4e47-a653-985407daca39', 'Arroz inflado / crispi', 0.008, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('c00cb88d-d23c-4b21-9d82-7f510630e7b0', 'cbd41beb-7560-4e47-a653-985407daca39', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('2201f307-4b4b-4495-9a91-cfcac2d5bc16', 'eed9a72c-9cf5-4324-bef7-fd7f80628831', 'Pasta/licor de cacao', 0.025, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('2b0dea86-8ec1-4429-9349-9571d689c1aa', 'eed9a72c-9cf5-4324-bef7-fd7f80628831', 'Manteca de cacao', 0.015, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('258bdcbc-cace-4e2b-bcf3-a4c832eaeb1d', 'eed9a72c-9cf5-4324-bef7-fd7f80628831', 'Leche en polvo', 0.012, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('dbb7268d-a36f-42d4-8688-86dfb786ad7f', 'eed9a72c-9cf5-4324-bef7-fd7f80628831', 'Stevia en polvo', 0.003, 'kg') ON CONFLICT DO NOTHING;
INSERT INTO recetas (id, producto_id, nombre_materia_prima, cantidad_por_unidad, unidad) VALUES ('a40d30d1-ece9-4653-b565-846000271a31', 'eed9a72c-9cf5-4324-bef7-fd7f80628831', 'Empaques (film + etiqueta)', 1, 'unidad') ON CONFLICT DO NOTHING;

-- 5. Materias Primas
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('db025554-3b19-41c4-a833-87307fd6b6dc', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Pasta/licor de cacao', 'kg', 50, 5.2, 10) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('3a57bed7-e604-43fd-95bd-734d68734727', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Manteca de cacao', 'kg', 25, 9.5, 5) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('2abbcf60-d2cd-4c77-a5e9-7f48e73e5817', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Azúcar blanca', 'kg', 100, 0.72, 20) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('69f7153a-df5b-4df5-b214-87a34c550596', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Leche en polvo', 'kg', 40, 5, 10) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('95bb66f0-ec24-4fa0-b5c5-40f93253fb0a', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Cobertura chocolate importada', 'kg', 30, 7, 10) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('879c7260-2a86-4e1f-bbdf-3abd37d9f83c', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Coco rallado tostado', 'kg', 15, 4.2, 5) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('f673ee9a-c011-4803-8eff-f2ba98d6edf5', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Maní / mantequilla de maní', 'kg', 12, 3.8, 5) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('a5787709-e626-488d-adbe-6d72843b3885', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Pistacho pelado', 'kg', 8, 22, 3) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('d5b3176c-1910-4064-9045-d7a3e402543f', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Fresa liofilizada', 'kg', 5, 25, 2) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('3899788b-8129-46eb-a7a7-9c89d042fa1b', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Maracuyá pulpa congelada', 'kg', 15, 3, 5) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('17cb453d-febb-4c0c-a290-4190de50bd57', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Kataifi (fideos crujientes)', 'kg', 6, 12, 3) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('91c4db16-16f0-4aa8-8e82-710875e7c725', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Tahini (pasta de sésamo)', 'kg', 5, 8.5, 3) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('16867015-216f-422c-82d9-539b20e3f946', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Vainilla extracto natural', 'litro', 2, 28, 0.5) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('3102f3bf-e460-4400-9e92-856d2cc7dc86', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Stevia en polvo', 'kg', 3, 35, 2) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('db1d1d68-dbf2-4efe-8566-04e1f813427f', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Lecitina de soya', 'kg', 8, 6.5, 3) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('8ad501a7-f136-46d3-a16c-b6604fdc4d89', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Arroz inflado / crispi', 'kg', 10, 4, 5) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('6069d236-2db9-4863-b350-2aab03692e03', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Pop rocks comestibles', 'kg', 2, 45, 1) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('57d19ade-e978-43aa-8646-c1a579b2ffdd', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Empaques (film + etiqueta)', 'unidad', 2000, 0.13, 500) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('11d40076-272a-4926-89ba-2d463b85dfbf', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Cajas cartón gift box', 'unidad', 200, 0.85, 100) ON CONFLICT DO NOTHING;
INSERT INTO materias_primas (id, inventario_id, nombre, unidad, cantidad_disponible, precio_unitario, stock_minimo_alerta) VALUES ('c9aca39a-62e5-4637-8ff1-f868762031ce', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Tarros de vidrio 200g', 'unidad', 150, 0.7, 100) ON CONFLICT DO NOTHING;

-- 6. Maquinas
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('dd9543ea-f69c-41f8-8640-7846d0fd1440', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Temperadora #1', 'temperadora', 2, 'activa', 'Capacidad 10 kg/batch') ON CONFLICT DO NOTHING;
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('4a58cc0f-3886-4eb6-941c-14b722310c69', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Temperadora #2', 'temperadora', 2.5, 'activa', 'Capacidad 15 kg/batch') ON CONFLICT DO NOTHING;
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('10f7972b-e816-4c59-be91-9dd50c5c2cb6', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Refinadora / Molino de bolas', 'refinadora', 5, 'activa', 'Capacidad 20 kg/batch') ON CONFLICT DO NOTHING;
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('1ec17042-4b31-4de6-b17e-0657717feecb', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Túnel de enfriamiento', 'tunel', 3, 'activa', 'Continuo ~60 u/min') ON CONFLICT DO NOTHING;
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('9d04da8e-22c5-49fe-97e1-3d77c6970f51', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Moldeadora semiautomática', 'moldeadora', 1.5, 'activa', '300 u/hora') ON CONFLICT DO NOTHING;
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('5a02b97e-6da8-4ecd-9552-d4f4fe79c2b1', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Envolvedora / Selladora', 'selladora', 1, 'activa', '45 u/min') ON CONFLICT DO NOTHING;
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('a3e4d39a-46c0-40e8-83c9-ba0f15460b2a', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Cámara de refrigeración', 'refrigeracion', 1.5, 'activa', '24h continuo') ON CONFLICT DO NOTHING;
INSERT INTO maquinas (id, inventario_id, nombre, tipo, potencia_kw, estado, notas) VALUES ('84fcb17f-81bc-4e7a-b5dd-6048e8a70c69', 'a2e3238e-6c7d-4474-8367-c74dfa67e205', 'Mezcladora industrial', 'mezcladora', 2, 'activa', 'Capacidad 30 kg/batch') ON CONFLICT DO NOTHING;

-- 7. Trabajadores
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('a7e269c7-229b-4c99-84b8-3eb1ae122f8c', 'Carlos Mendoza', '0102345678', 'Operario Senior', 'produccion', 520, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('d2355de0-3018-4601-93e7-99f9c82399c6', 'María Fernanda López', '0103456789', 'Operaria', 'produccion', 480, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('b6ffd21a-4b6b-4ba6-91bc-c8e50a3da89f', 'Luis Alberto Ríos', '0104567890', 'Operario', 'produccion', 480, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('e69eb819-38c3-4b90-ab59-f35e6ac77a58', 'Ana Sofía Paredes', '0105678901', 'Operaria', 'produccion', 460, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('0430d227-79ca-4710-8888-6f0c89c9a1c8', 'Pedro Chávez', '0106789012', 'Supervisor de Planta', 'produccion', 750, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('344c89ae-9bad-43f5-aa05-2bed56be14cc', 'Rosa Campoverde', '0107890123', 'Contadora', 'contabilidad', 850, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('89f652cb-bda8-4576-bc6b-496f26f53db9', 'Jorge Espinoza', '0108901234', 'Repartidor', 'reparto', 480, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('c9f37399-48ca-4b54-95d3-9c2453e54ae9', 'Carmen Vélez', '0109012345', 'Limpieza', 'limpieza', 460, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('3120d41d-1d6c-4ada-a110-ca38f528c769', 'Diego Morocho', '0110123456', 'Operario', 'produccion', 480, 8, true) ON CONFLICT DO NOTHING;
INSERT INTO trabajadores (id, nombre, cedula, cargo, area, salario_mensual, horas_diarias, activo) VALUES ('0f60b5c0-f94f-4940-836c-1428a3de85f7', 'Gabriela Serrano', '0111234567', 'Administradora', 'admin', 900, 8, true) ON CONFLICT DO NOTHING;

