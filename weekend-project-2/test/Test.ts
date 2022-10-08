import { expect } from "chai";

describe("when creating", async () => {
    it("should create a new ballot", async () => {
        const proposals = ["Cofee", "Tea"];
        expect(proposals.length).to.equal(2); 
    });
});