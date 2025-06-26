//Grupo 1: Casos Positivos (El "Happy Path")

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import TestData from '../datos/testDatos.json';
import { DashboardPage } from '../pages/dashboardPage';
import fs from 'fs';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let usuarioValido: { email: string, password: string };

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();
});


test('TC-1.1 Login Exitoso y Redirección al Dashboard', async ({ page }) => {
  // Leer el email que se generó en TC-5
  const { email } = JSON.parse(fs.readFileSync('correo-temp.json', 'utf8'));

  // Actualizar los datos del usuario para el login
  TestData.usuarioValido.email = email;

  // Realizar login y verificar mensajes
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible({ timeout: 3000 });
  await expect(dashboardPage.dashboardTitle).toBeVisible();
}); 

test('TC-2.1 Mostrar mensaje de error con credenciales inválidas', async ({ page }) => {
  // Usar email no registrado y contraseña incorrecta
  const invalidCredentials = {
    email: 'correo.no.existe@dominio.com',
    contraseña: 'contrasenaIncorrecta123'
  };

  // Intentar hacer login
  await loginPage.completarYHacerClickBotonLogin(invalidCredentials);

  // Verificar que se muestra un mensaje de error
  await expect(page.getByText('Invalid Credentials')).toBeVisible();

  // Verificar que NO se redirige al dashboard
  await expect(page).not.toHaveURL(/\/dashboard/);

  // (Opcional) Verificar que seguimos en /login
  await expect(page).toHaveURL(/\/login/);

}); 

test('TC-2.2 Intento de Login con Campos Vacíos ', async ({ page }) => {

const loginPage = new LoginPage(page);
  await loginPage.visitarPaginaLogin();

  // No llenar ningún campo y hacer clic en "Iniciar Sesión"
  await page.click('button:text("Iniciar Sesión")');

  // Esperar un poco para ver si hay navegación (no debería haberla)
  await page.waitForTimeout(1000);

  // Verificar que seguimos en /login
  await expect(page).toHaveURL(/\/login/);

  }); 

test('TC-2.3 Intento de Login con Email sin Contraseña ', async ({ page }) => {

// Usar email no registrado y contraseña incorrecta
  const emailSinContrasena = {
    email: 'correo.no.existe@dominio.com',
    contraseña: ''
  };

  // Intentar hacer login
  await loginPage.completarYHacerClickBotonLogin(emailSinContrasena);

  // Verificar que se muestra un mensaje de error
  await expect(page.getByText('Rellene este campo')).toBeVisible();

  // Verificar que NO se redirige al dashboard
  await expect(page).not.toHaveURL(/\/dashboard/);

  // (Opcional) Verificar que seguimos en /login
  await expect(page).toHaveURL(/\/login/);
});
