import pgPromise from "pg-promise";
import pgConfig from "../config/postgres.config.js";

class PGConnector {
	constructor() {
		const pgp = pgPromise({});
		this.db = pgp(pgConfig);
	}

	executeStoredProcedure(name, args = []) {
		return this.db.func(name, args)
			.then((response) => response)
			.catch((err) => {
				throw new Error("Couldn't invoke Stored Procedure: ".concat(err));
			});
	}
}

export default new PGConnector();
