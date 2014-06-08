"use strict";

function stringify(obj) {
    return JSON.stringify(obj, null, 2);
}

describe("syncChildren", function() {

    it("Enabling parent should enable it's descendants", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    layers: [
                        {id: "d"}
                    ]
                }
            ],
            enabled: true
        };

        var output = {
            id: "a",
            layers: [
                {
                    id: "b",
                    enabled: true
                },
                {
                    id: "c",
                    layers: [
                        {
                            id: "d",
                            enabled: true
                        }
                    ],
                    enabled: true
                }
            ],
            enabled: true
        };

        expect(stringify(syncChildren(input))).toEqual(stringify(output));

    });

    it("Disabling parent should disable it's descendants", function() {

        var input = {
            id: "a",
            layers: [
                {
                    id: "b",
                    enabled: true
                },
                {
                    id: "c",
                    enabled: true
                }
            ],
            enabled: false
        };

        var output = {
            id: "a",
            layers: [
                {
                    id: "b",
                    enabled: false
                },
                {
                    id: "c",
                    enabled: false
                }
            ],
            enabled: false
        };

        expect(stringify(syncChildren(input))).toEqual(stringify(output));

    });

});

describe("findLayer", function() {

    it("Should find layer by id", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {id: "c"}
            ]
        };

        var output = {id: "b"};

        expect(findLayer(input, output.id).id).toEqual(output.id);

    });

    it("Should find nested layer", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    layers: [
                        {id: "d"}
                    ]
                },
                {
                    id: "e",
                    layers: [
                        {id: "f"}
                    ]
                }
            ]
        };

        var output = {id: "f"};

        expect(findLayer(input, output.id).id).toEqual(output.id);

    });

    it("Should return null if layer is not found", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    layers: [
                        {
                            id: "d",
                            enabled: true
                        }
                    ]
                }
            ]
        };

        expect(findLayer(input, "z")).toEqual(null);

    });

});

describe("syncParents", function() {

    it("Should enable parent when a child is enabled", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    enabled: true
                }
            ]
        };

        var output = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    enabled: true
                }
            ],
            enabled: true
        };

        expect(stringify(syncParents(input))).toEqual(stringify(output));
    });

    it("Should disable parent when no children are enabled", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {id: "c"}
            ]
        };

        var output = {
            id: "a",
            layers: [
                {id: "b"},
                {id: "c"}
            ],
            enabled: false
        };

        expect(stringify(syncParents(input))).toEqual(stringify(output));
    });

    it("Should enable parent when more than one child is enabled", function() {

        var input = {
            id: "a",
            layers: [
                {
                    id: "b",
                    enabled: true
                },
                {
                    id: "c",
                    enabled: true
                }
            ]
        };

        var output = {
            id: "a",
            layers: [
                {
                    id: "b",
                    enabled: true
                },
                {
                    id: "c",
                    enabled: true
                }
            ],
            enabled: true
        };

        expect(stringify(syncParents(input))).toEqual(stringify(output));
    });

    it("Should always set a parents enabled state to be consistent with children", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {id: "c"}
            ],
            enabled: true
        };

        var output = {
            id: "a",
            layers: [
                {id: "b"},
                {id: "c"}
            ],
            enabled: false
        };

        expect(stringify(syncParents(input))).toEqual(stringify(output));
    });

    it("Should enable parents up the tree when a nested child is enabled", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    layers: [
                        {
                            id: "d",
                            enabled: true
                        }
                    ]
                }
            ]
        };

        var output = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    layers: [
                        {
                            id: "d",
                            enabled: true
                        }
                    ],
                    enabled: true
                }
            ],
            enabled: true
        };

        expect(stringify(syncParents(input))).toEqual(stringify(output));
    });

    it("Should handle multiple branches", function() {

        var input = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    layers: [
                        {
                            id: "d",
                            enabled: true
                        }
                    ]
                },
                {
                    id: "e",
                    layers: [
                        {
                            id: "f",
                            enabled: true
                        },
                        {id: "g"}
                    ]
                }
            ]
        };

        var output = {
            id: "a",
            layers: [
                {id: "b"},
                {
                    id: "c",
                    layers: [
                        {
                            id: "d",
                            enabled: true
                        }
                    ],
                    enabled: true
                },
                {
                    id: "e",
                    layers: [
                        {
                            id: "f",
                            enabled: true
                        },
                        {id: "g"}
                    ],
                    enabled: true
                }
            ],
            enabled: true
        };

        expect(stringify(syncParents(input))).toEqual(stringify(output));
    });

    it("Groups with no children are always disabled", function() {

        var input = {
            id: "a",
            layers: [],
            enabled: true
        };

        var output = {
            id: "a",
            layers: [],
            enabled: false
        };

        expect(stringify(syncParents(input))).toEqual(stringify(output));
    });

});
