import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("I open the homepage", () => {
  cy.visit("http://localhost:3001");
});

Then("I should see {string}", (text) => {
  cy.contains(text);
});

