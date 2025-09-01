import { test } from '@playwright/test'


test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/')
})

test.describe('suite01', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Charts').click()
    })


    test('the first test', async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('navigate to Datepicker Page', async ({ page }) => {
        await page.getByText('Datepicker').click()
    })

})


test.describe('suite02', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
    })

    test('the first test', async ({ page }) => {
        await page.getByText('Form Layouts').click()
    })

    test('navigate to Datepicker Page', async ({ page }) => {
        await page.getByText('Datepicker').click()
    })

})

