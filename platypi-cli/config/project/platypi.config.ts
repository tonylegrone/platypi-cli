class Config implements config.IPlatypi {
    private __name: string = 'New Platypi Project';
    private __author = 'Platypi';
    private __homepage = 'http://getplatypi.com';
    private __type = 'web';

    get name(): string {
        return this.__name;
    }

    set name(value: string) {
        this.__name = value;
    }

    get author(): string {
        return this.__author;
    }

    set author(value: string) {
        this.__author = value;
    }

    get type(): string {
        return this.__type;
    }

    set type(value: string) {
        this.__type = value.toLowerCase();
    }


}
