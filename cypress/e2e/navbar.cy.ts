describe("navbar on PC screen", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit("/", { failOnStatusCode: false })

    // wait for all necessary components to load
    cy.dataTest("nav-clerk-buttons").within(() => {
      cy.get("button").should("have.length", 2)
    })
  })

  it("before signing in", () => {
    // check the position of the navbar
    cy.dataTest("nav-bar").then((el) => {
      expect(el[0].offsetTop).to.equal(0)
      expect(el[0].offsetLeft).to.equal(0)
      expect(el[0].offsetWidth).to.equal(1280)
    })

    cy.location("pathname").should("equal", "/")

    // click the logo
    cy.dataTest("nav-logo").click()
    cy.location("pathname").should("equal", "/")

    // click the "home" button
    cy.dataTest("nav-home").contains(/home/i)
    cy.dataTest("nav-home").click()
    cy.location("pathname").should("equal", "/")

    // when not signed in, clicking on the create button should open the sign-in modal
    cy.dataTest("nav-create").contains(/create/i)
    cy.dataTest("nav-create").click()
    cy.get(".cl-modalContent").within(() => {
      cy.contains(/to continue to Pinterest/i)
      cy.get(".cl-modalCloseButton").click()
    })
    cy.get(".cl-modalContent").should("not.exist")

    // click on the notifications button
    cy.dataTest("nav-notifications").click()
    cy.location("pathname").should("equal", "/")

    // click on the messages button
    cy.dataTest("nav-messages").click()
    cy.location("pathname").should("equal", "/")

    // click on the profile button
    cy.dataTest("nav-sign-in").click()
    cy.get(".cl-modalContent").within(() => {
      cy.contains(/to continue to Pinterest/i)
      cy.get(".cl-modalCloseButton").click()
    })
  })

  it("after signing in", () => {
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

    // click the "Create" button
    cy.dataTest("nav-create").click()
    cy.location("pathname").should("equal", "/idea-pin-builder")
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    // click the "Profile" button
    cy.dataTest("nav-profile").click()
    cy.location("pathname").should("match", /\/user\/.+\/created/i)
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    // click the downward arrow next to the profile button
    cy.dataTest("nav-profile-dropdown-arrow").click()
    cy.dataTest("dropdown-list-wrapper").within(() => {
      cy.dataTest("dropdown-list-item").its(0).should("have.text", "Settings")
      cy.dataTest("dropdown-list-item").its(1).should("have.text", "Sign out")

      cy.contains("Settings").click()
      cy.location("pathname").should("equal", "/settings")
      cy.dataTest("loading-spinner", 10000).should("not.exist")
    })

    // sign out
    cy.dataTest("nav-home").click()
    cy.dataTest("loading-spinner", 10000).should("not.exist")
    cy.dataTest("nav-profile-dropdown-arrow").click()
    cy.dataTest("dropdown-list-wrapper").within(() => {
      cy.contains("Sign out").click()
    })

    // verify that the user is signed out
    cy.dataTest("nav-sign-in")
  })
})

describe("navbar on tablet screen", () => {
  beforeEach(() => {
    cy.viewport(800, 650)
    cy.visit("/", { failOnStatusCode: false })
    cy.dataTest("nav-clerk-buttons").within(() => {
      cy.get("button").should("have.length", 1)
    })
  })
  it("before signing in", () => {
    // check the position of the navbar
    cy.dataTest("nav-bar").then((el) => {
      expect(el[0].offsetTop).to.be.closeTo(550, 50)
      expect(el[0].offsetLeft).to.be.closeTo(400, 50)
    })

    cy.dataTest("nav-search").click()
    cy.location("pathname").should("equal", "/search-mobile")
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    cy.dataTest("nav-home").click()
    cy.location("pathname").should("equal", "/")

    cy.dataTest("nav-sign-in").click()
    cy.get(".cl-modalContent")
  })

  it("after signing in", () => {
    // sign in
    cy.dataTest("nav-sign-in").click()
    cy.get(".cl-modalContent").within(() => {
      cy.get("input[id='identifier-field']").type("richard")
      cy.contains("button", /^continue$/i).click()

      cy.get("input[id='password-field']").type("771446555")
      cy.contains("button", /^continue$/i).click()
    })
    cy.get(".cl-modalContent").should("not.exist")

    // click the "Profile" button
    cy.dataTest("nav-profile").click()
    cy.location("pathname").should("match", /\/user\/.+\/created/i)
    cy.dataTest("loading-spinner", 10000).should("not.exist")
  })
})

describe("navbar on mobile screen", () => {
  it.only("before signing in", () => {
    cy.viewport(600, 800)
    cy.visit("/", { failOnStatusCode: false })
    cy.dataTest("nav-clerk-buttons").within(() => {
      cy.get("button").should("have.length", 1)
    })

    // check the position of the navbar
    cy.dataTest("nav-bar").then((el) => {
      expect(el[0].offsetTop).to.be.closeTo(750, 50)
      expect(el[0].offsetLeft).to.equal(0)
      expect(el[0].offsetWidth).to.equal(600)
    })
  })
})
