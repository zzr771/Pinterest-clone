describe("settings", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit("/", { failOnStatusCode: false })

    // wait for all necessary components to load
    cy.dataTest("nav-clerk-buttons").within(() => {
      cy.get("button").should("have.length", 2)
    })

    // sign in
    cy.dataTest("nav-sign-in").click()
    cy.get(".cl-modalContent").within(() => {
      cy.get("input[id='identifier-field']").type("richard")
      cy.contains("button", /^continue$/i).click()

      cy.get("input[id='password-field']").type("771446555")
      cy.contains("button", /^continue$/i).click()
    })
    cy.get(".cl-modalContent").should("not.exist")
    cy.dataTest("nav-profile")

    // navigate to settings
    cy.visit("/settings")
    cy.dataTest("loading-spinner", 10000).should("not.exist")
  })

  it("should show error message when filling in invalid values", () => {
    // clear the 'first name' field
    cy.dataTest("first-name-input").type("{selectAll}{backspace}")
    cy.dataTest("first-name").contains("Your profile needs a name")

    // Type more than 30 characters in the 'first name' field
    cy.dataTest("first-name-input").type("a".repeat(31))
    cy.dataTest("first-name").contains("Please enter no more than 30 characters.")

    // Type more than 30 characters in the 'last name' field
    cy.dataTest("last-name-input").type("a".repeat(31))
    cy.dataTest("last-name").contains("Please enter no more than 30 characters.")

    // Type more than 500 characters in the 'about' field
    cy.dataTest("virtual-textarea").type("a".repeat(501))
    cy.dataTest("about").contains("Please enter no more than 500 characters.")

    // Type a invalid URL
    cy.dataTest("website-input").type("https://www")
    cy.dataTest("website").contains("Oops! That URL isn't valid. Please try again!")

    // Clear the 'username' field
    cy.dataTest("username-input").type("{selectAll}{backspace}")
    cy.dataTest("username").contains("Your profile needs a username")

    // Type more than 50 characters in the 'username' field
    cy.dataTest("username-input").type("a".repeat(51))
    cy.dataTest("username").contains("Please enter no more than 50 characters.")
  })

  it("should save changes when the Save button is clicked", () => {
    // Type a valid first name
    cy.dataTest("first-name-input").type("{selectAll}{backspace}richard")
    cy.dataTest("first-name").contains("Your profile needs a name").should("not.exist")
    cy.dataTest("first-name").contains("Please enter no more than 30 characters.").should("not.exist")

    // Type a valid 'last name'
    cy.dataTest("last-name-input").type("{selectAll}{backspace}smith")
    cy.dataTest("last-name").contains("Please enter no more than 30 characters.").should("not.exist")

    // Type some XSS code in the 'about' field
    cy.dataTest("virtual-textarea").type("{selectAll}{backspace}<script>alert('hello')</script>")
    cy.dataTest("about").contains("Please enter no more than 500 characters.").should("not.exist")

    // Type a valid URL
    cy.dataTest("website-input").type("{selectAll}{backspace}https://www.bing.com")
    cy.dataTest("website").contains("Oops! That URL isn't valid. Please try again!").should("not.exist")

    // Type a valid 'username'
    cy.dataTest("username-input").type("{selectAll}{backspace}richard")
    cy.dataTest("username").contains("Your profile needs a username").should("not.exist")
    cy.dataTest("username").contains("Please enter no more than 50 characters.").should("not.exist")

    // Save the changes
    cy.dataTest("save-button").click()
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    // Should show right fields
    cy.dataTest("first-name-input").should("have.value", "richard")
    cy.dataTest("last-name-input").should("have.value", "smith")
    cy.dataTest("virtual-textarea").should("contain.text", "<script>alert('hello')</script>")
    cy.dataTest("website-input").should("have.value", "https://www.bing.com")
    cy.dataTest("username-input").should("have.value", "richard")
  })

  it("buttons should be disabled when no changes are made", () => {
    cy.dataTest("save-button").should("be.disabled")
    cy.dataTest("reset-button").should("be.disabled")

    // change the 'first name' field
    cy.dataTest("first-name-input").type("a")
    cy.dataTest("save-button").should("be.enabled")
    cy.dataTest("reset-button").should("be.enabled")

    // restore the 'first name' field
    cy.dataTest("first-name-input").type("{backspace}")
    cy.dataTest("save-button").should("be.disabled")
    cy.dataTest("reset-button").should("be.disabled")

    // change the 'last name' field
    cy.dataTest("last-name-input").type("a")
    cy.dataTest("save-button").should("be.enabled")
    cy.dataTest("reset-button").should("be.enabled")

    // restore the 'last name' field
    cy.dataTest("last-name-input").type("{backspace}")
    cy.dataTest("save-button").should("be.disabled")
    cy.dataTest("reset-button").should("be.disabled")

    // change the 'about' field
    cy.dataTest("virtual-textarea").type("a")
    cy.dataTest("save-button").should("be.enabled")
    cy.dataTest("reset-button").should("be.enabled")

    // restore the 'about' field
    cy.dataTest("virtual-textarea").type("{backspace}")
    cy.dataTest("save-button").should("be.disabled")
    cy.dataTest("reset-button").should("be.disabled")

    // change the 'website' field
    cy.dataTest("website-input").type("a")
    cy.dataTest("save-button").should("be.enabled")
    cy.dataTest("reset-button").should("be.enabled")

    // restore the 'website' field
    cy.dataTest("website-input").type("{backspace}")
    cy.dataTest("save-button").should("be.disabled")
    cy.dataTest("reset-button").should("be.disabled")

    // change the 'username' field
    cy.dataTest("username-input").type("a")
    cy.dataTest("save-button").should("be.enabled")
    cy.dataTest("reset-button").should("be.enabled")

    // restore the 'username' field
    cy.dataTest("username-input").type("{backspace}")
    cy.dataTest("save-button").should("be.disabled")
    cy.dataTest("reset-button").should("be.disabled")
  })

  it.only("should restore the original values when the Reset button is clicked", () => {
    cy.dataTest("first-name-input").type("a")
    cy.dataTest("last-name-input").type("a")
    cy.dataTest("virtual-textarea").type("a")
    cy.dataTest("website-input").type("a")
    cy.dataTest("username-input").type("a")

    cy.dataTest("reset-button").click()

    cy.dataTest("first-name-input").should("have.value", "richard")
    cy.dataTest("last-name-input").should("have.value", "smith")
    cy.dataTest("virtual-textarea").should("contain.text", "<script>alert('hello')</script>")
    cy.dataTest("website-input").should("have.value", "https://www.bing.com")
    cy.dataTest("username-input").should("have.value", "richard")
  })
})
