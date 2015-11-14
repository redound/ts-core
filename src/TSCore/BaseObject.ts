module TSCore {

	export class BaseObject {

		public get static() {
			return Object.getPrototypeOf(this).constructor;
		}
	}
}