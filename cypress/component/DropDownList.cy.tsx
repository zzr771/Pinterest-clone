import DropDownList from "@/components/shared/DropDownList"

describe("DropDownList", () => {
  beforeEach(() => {
    const option1 = {
      label: "Save",
      callback: () => {
        console.log("save clicked")
      },
    }
    cy.spy(option1, "callback").as("callbackSpy")

    const options = [
      option1,
      {
        label: "Delete",
        callback: () => {},
      },
      {
        label: "Cancel",
      },
    ]

    cy.mount(
      <div className="flex justify-center h-screen w-screen">
        <DropDownList options={options} position={{ offsetY: 65 }} className="mx-auto">
          <button className="h-14 w-36 shadow-lg rounded-full">More Options</button>
        </DropDownList>
      </div>
    )
  })

  it("toggle the dropdown list", () => {
    cy.get("[data-test=dropdown-list-button-wrapper] button").contains("More Options").click()

    cy.dataTest("dropdown-list-item").should("have.length", 3)
    cy.dataTest("dropdown-list-item").its(0).should("contain.text", "Save")
    cy.dataTest("dropdown-list-item").its(1).should("contain.text", "Delete")
    cy.dataTest("dropdown-list-item").its(2).should("contain.text", "Cancel")

    cy.get("body").click()
    cy.dataTest("dropdown-list-wrapper").should("not.exist")

    cy.get("[data-test=dropdown-list-button-wrapper] button").click()
    cy.dataTest("dropdown-list-wrapper")
    cy.dataTest("dropdown-list-item").eq(0).click()
    cy.dataTest("dropdown-list-wrapper").should("not.exist")

    cy.get("[data-test=dropdown-list-button-wrapper] button").click()
    cy.dataTest("dropdown-list-wrapper")
    cy.dataTest("dropdown-list-item").eq(2).click()
    cy.dataTest("dropdown-list-wrapper").should("not.exist")
  })

  it("call the callback function when an option is clicked", () => {
    cy.get("[data-test=dropdown-list-button-wrapper] button").click()

    cy.dataTest("dropdown-list-item").eq(0).click()
    cy.dataTest("dropdown-list-wrapper").should("not.exist")

    cy.get("@callbackSpy").should("be.called")
  })
})
