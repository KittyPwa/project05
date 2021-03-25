function Images() {

    this.base = new Map();

    this.getImg = function(key) {
        return this.base.get(key)
    }

    this.hasImg = function(key) {
        return this.base.has(key)
    }

    this.putImg = function(key, img) {
        this.base.set(key,img);
    }
}