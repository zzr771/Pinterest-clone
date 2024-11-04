describe("search on PC", () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
    cy.visit("/", { failOnStatusCode: false })

    // wait for all necessary components to load
    cy.dataTest("nav-clerk-buttons").within(() => {
      cy.get("button")
    })
  })

  it("search suggestion panel", () => {
    // click on the search bar, search suggestion panel should appear
    cy.dataTest("nav-search").click()
    cy.dataTest("search-suggestion-wrapper").within(() => {
      cy.contains(/ideas for you/i)
      cy.contains(/popular on pinterest/i)

      cy.dataTest("search-suggestion-card").should("have.length", 8)
      for (let i = 0; i < 8; i++) {
        cy.dataTest("search-suggestion-card")
          .its(i)
          .within(() => {
            cy.get("img").should("be.visible")
            cy.get("span").contains(/[a-zA-Z0-9]/)
          })
      }
    })
    // toggle the search suggestion panel
    cy.dataTest("search-suggestion-close").click()
    cy.dataTest("search-suggestion-wrapper").should("not.exist")

    cy.dataTest("nav-search").click()
    cy.dataTest("nav-notifications").click()
    cy.dataTest("search-suggestion-wrapper").should("not.exist")

    cy.dataTest("nav-search").click()
    cy.dataTest("modal").click({ force: true })
    cy.dataTest("search-suggestion-wrapper").should("not.exist")
  })

  it("search results and search history", () => {
    cy.dataTest("search-input").type("pic{enter}")
    cy.location("pathname").should("eq", "/search/pic")
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    // search result
    cy.get("[data-test='pin-card'] h5").each((item) => {
      expect(item[0].textContent).match(/pic/i)
    })

    // search for another term
    cy.dataTest("search-input").type("{backspace}{backspace}{backspace}ai{enter}")
    cy.location("pathname").should("eq", "/search/ai")
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    // search history
    cy.dataTest("search-input").click()
    cy.dataTest("search-history-item").should("have.length", 2)
    cy.dataTest("search-history-item").its(0).should("contain.text", "ai")
    cy.dataTest("search-history-item").its(1).should("contain.text", "pic")

    // click on item "pic"
    cy.get("[data-test='search-history-item']:nth-child(2)").click()
    cy.location("pathname").should("eq", "/search/pic")
    cy.dataTest("search-input").click()
    cy.dataTest("search-history-item").its(0).should("contain.text", "pic")
    cy.dataTest("search-history-item").its(1).should("contain.text", "ai")

    // delete search history items
    cy.dataTest("search-history-item")
      .its(0)
      .within(() => {
        cy.get("svg").click()
      })
    cy.dataTest("search-input").click()
    cy.dataTest("search-history-item").should("contain.text", "ai")
    cy.dataTest("search-history-item").within(() => {
      cy.get("svg").click()
    })
    cy.dataTest("search-input").click()
    cy.dataTest("search-history-item").should("not.exist")
    cy.dataTest("search-suggestion-wrapper").should("not.contain.text", "Recent searches")
  })
})

describe("search on mobile/tablet", () => {
  beforeEach(() => {
    cy.viewport(500, 800)
    cy.visit("/search-mobile", { failOnStatusCode: false })

    // wait for all necessary components to load
    cy.dataTest("nav-clerk-buttons").within(() => {
      cy.get("button")
    })
  })

  it.only("search results and search history", () => {
    cy.dataTest("search-input").type("pic{enter}")
    cy.location("pathname").should("eq", "/search-mobile/pic")
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    // search result
    cy.get("[data-test='pin-card'] h5").each((item) => {
      expect(item[0].textContent).match(/pic/i)
    })

    // search for another term
    cy.dataTest("search-input").type("{backspace}{backspace}{backspace}ai{enter}")
    cy.location("pathname").should("eq", "/search-mobile/ai")
    cy.dataTest("loading-spinner", 10000).should("not.exist")

    // search history
    cy.dataTest("search-input").focus()
    cy.dataTest("search-history-item").should("have.length", 2)
    cy.dataTest("search-history-item").its(0).should("contain.text", "ai")
    cy.dataTest("search-history-item").its(1).should("contain.text", "pic")

    // click on item "pic"
    cy.get("[data-test='search-history-item']:nth-child(2)").click()
    cy.location("pathname").should("eq", "/search-mobile/pic")
    cy.dataTest("search-input").focus()
    cy.dataTest("search-history-item").its(0).should("contain.text", "pic")
    cy.dataTest("search-history-item").its(1).should("contain.text", "ai")

    // delete search history items
    cy.dataTest("search-history-item")
      .its(0)
      .within(() => {
        cy.get("svg:nth-child(2)").click()
      })
    cy.dataTest("search-input").focus()
    cy.dataTest("search-history-item").should("contain.text", "ai")
    cy.dataTest("search-history-item").within(() => {
      cy.get("svg:nth-child(2)").click()
    })
    cy.dataTest("search-input").focus()
    cy.dataTest("search-history-item").should("not.exist")

    cy.get("button:contains('Cancel')").click()
    cy.dataTest("search-suggestion-list").should("not.exist")
  })
})
