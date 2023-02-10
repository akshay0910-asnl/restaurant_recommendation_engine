import Cuisine from "./Cuisine";

class CuisineTracking{
    cuisine: Cuisine;
    noOfOrders: number;
    constructor(cuisine: Cuisine,costBracket: number){
        this.cuisine = cuisine;
        this.noOfOrders = costBracket;
    }
}

export default CuisineTracking;