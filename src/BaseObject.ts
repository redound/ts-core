export default class BaseObject {

    public get source() {
        return Object.getPrototypeOf(this).constructor;
    }
}
