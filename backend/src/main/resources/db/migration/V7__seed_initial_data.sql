-- Seed Roles
INSERT INTO roles (id, name, description) VALUES 
(uuid_generate_v4(), 'SUPER_ADMIN', 'Full system access'),
(uuid_generate_v4(), 'ADMIN', 'Institutional management access'),
(uuid_generate_v4(), 'MANAGER', 'Operational management access'),
(uuid_generate_v4(), 'EDITOR', 'Content management access'),
(uuid_generate_v4(), 'EMPLOYEE', 'Operational processing access'),
(uuid_generate_v4(), 'CITIZEN', 'Citizen access');

-- Seed Departments
INSERT INTO departments (id, name, slug, status) VALUES 
(uuid_generate_v4(), 'Administração Municipal', 'administracao-municipal', 'ACTIVE'),
(uuid_generate_v4(), 'Finanças e Tributos', 'financas-e-tributos', 'ACTIVE'),
(uuid_generate_v4(), 'Urbanização e Construção', 'urbanizacao-e-construcao', 'ACTIVE'),
(uuid_generate_v4(), 'Serviços Sociais', 'servicos-sociais', 'ACTIVE'),
(uuid_generate_v4(), 'Atendimento ao Munícipe', 'atendimento-ao-municipe', 'ACTIVE');

-- Seed Districts
INSERT INTO districts (id, name, slug, status) VALUES 
(uuid_generate_v4(), 'Boane', 'boane', 'ACTIVE'),
(uuid_generate_v4(), 'Matola Rio', 'matola-rio', 'ACTIVE'),
(uuid_generate_v4(), 'Campoane', 'campoane', 'ACTIVE'),
(uuid_generate_v4(), 'Mahubo', 'mahubo', 'ACTIVE');

-- Note: Initial admin user will be created by application bootstrap to handle BCrypt hashing.
