import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import TestData from '../datos/testDatos.json';
import { DashboardPage } from '../pages/dashboardPage';
import fs from 'fs';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();
});


test('TC-7 Verificar inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
  // Leer el email que se generó en TC-5
  const { email } = JSON.parse(fs.readFileSync('correo-temp.json', 'utf8'));

  // Actualizar los datos del usuario para el login
  TestData.usuarioValido.email = email;

  // Realizar login y verificar mensajes
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible({ timeout: 3000 });
  await expect(dashboardPage.dashboardTitle).toBeVisible();
}); 

