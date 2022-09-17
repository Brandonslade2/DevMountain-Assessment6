
import { Builder, Capabilities, By } from "selenium-webdriver"

require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeAll(async () => { //switched this to beforeAll but it still didn't fix the below click issue.
    driver.get('http://localhost:3000/')
})

afterAll(async () => {
    driver.quit()
})

test('Title shows up when page loads', async () => {
    const title = await driver.findElement(By.id('title'))
    const displayed = await title.isDisplayed()
    expect(displayed).toBe(true)
    await driver.sleep(4000)
})

test("open the draw menu", async () => {
    const drawButton = await driver.findElement(By.id('draw'))
    await drawButton.click
    await driver.sleep(4000)
}) //its not making any sense how the actual click isn't working. I spent nearly 2 hours on this

test("click on 'DUEL!'", async () => {
    const drawButton = await driver.findElement(By.id('duel'))
    await drawButton.click
    await driver.sleep(4000)
}) //its not making any sense how the actual click isn't working. I spent nearly 2 hours on this
