import CostTracking from "./CostTracking";
import CuisineTracking from "./CuisineTracking";


class User {
	cuisines: CuisineTracking[];
	costBrackets:CostTracking[];
    
    constructor(cuisines: CuisineTracking[], costBrackets:CostTracking[]) {
        this.cuisines = cuisines;
        this.costBrackets = costBrackets;
    }
}

export default User;