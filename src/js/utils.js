

export class Utils{
    constructor() { /*this class is purely static. No constructor to see here*/ }

    rectsIntersect({ a, b }) {

        return (
            a.getGlobalPosition().x + a.width > b.getGlobalPosition().x - b.width / 2 &&
            a.getGlobalPosition().x < b.getGlobalPosition().x - b.width / 2 + b.width &&
            a.getGlobalPosition().y + a.height > b.getGlobalPosition().y - b.height / 2 &&
            a.getGlobalPosition().y < b.getGlobalPosition().y + b.height - b.height / 2
        );
    }
}