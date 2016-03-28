export default class Enum {

    static names(e:any) {

        return Object.keys(e).filter(v => isNaN(parseInt(v, 10)));
    }

    static values(e:any) {

        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static object(e:any) {

        return Enum.values(e).map(v => {

            return {
                name: <string>e[v],
                value: v
            };
        });
    }
}
