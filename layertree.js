"use strict";

var LayerItem = React.createClass({
    displayName: 'LayerItem',
    _onChange: function() {
        var layer = this.props.layer;
        layer.enabled = this.refs.checkbox.getDOMNode().checked;
        this.props.onLayerChange(layer);
    },
    render: function() {
        var layerList = null;
        if (this.props.layer.layers) {
            var layerNodes = this.props.layer.layers.map(function(layer) {
                return LayerItem({layer: layer, key: layer.id, onLayerChange: this.props.onLayerChange});
            }.bind(this));
            layerList = (
                React.DOM.ul({className: "layerItem"}, layerNodes)
            );
        }
        return (
            React.DOM.li(
                {
                    className: "layerItem"
                },
                React.DOM.input(
                    {
                        type: "checkbox",
                        checked: this.props.layer.enabled,
                        id: this.props.layer.id,
                        key: this.props.layer.id,
                        onChange: this._onChange,
                        ref: "checkbox"
                    }
                ),
                React.DOM.label(
                    {
                        htmlFor: this.props.layer.id
                    },
                    this.props.layer.name
                ),
                layerList
            )
        );
    }
});

var LayerTree = React.createClass({
    displayName: 'LayerTree',
    getInitialState: function() {
        return {layer: syncParents(this.props.layer)};
    },
    _onLayerChange: function(changedLayer) {
        var layer = findLayer(this.state.layer, changedLayer.id);
        layer.enabled = changedLayer.enabled;
        syncChildren(layer);
        this.setState(syncParents(this.state.layer));
        this.props.onChange(this.state.layer);
    },
    render: function() {
        return (
            React.DOM.ul(
                {className: "layerTree"},
                LayerItem({layer: this.state.layer, onLayerChange: this._onLayerChange})
            )
        );
    }
});

// -- LayerTree Logic -- //

/**
 * Find a layer by id in a tree of layers regardless of depth, assumes the id
 * is unique.
 */
function findLayer(layer, id) {
    function find(layer, id) {
        if (layer.id === id) {
            return layer;
        }
        if (layer.layers) {
            for (var i = 0, result; i < layer.layers.length; i++) {
                result = find(layer.layers[i], id);
                if (result) return result;
            }
        }
        return null;
    };
    return find(layer, id);
}

/**
 * When passed a layer with children set the enabled state of the children to
 * match that of the parent
 */
function syncChildren(layer) {
    var enabled = layer.enabled;
    function sync(layer, enabled) {
        layer.enabled = enabled;
        if (layer.layers) {
            for (var i = 0; i < layer.layers.length; i++) {
                sync(layer.layers[i], enabled);
            }
        }
    };
    sync(layer, enabled);
    return layer;
}

/**
 * Ensures that the enabled state of all parent layers is consistent with the
 * enabled state of their children. Generally passed the root of a layer tree.
 */
function syncParents(layers) {

    /**
     * Create a flattened Array of layer objects with each assigned a __parent
     * property that allows each layers parent to be determined
     */
    function flatten(layer, list) {
        list.push(layer);
        for (var i = 0, lyr; i < layer.layers.length; i++) {
            lyr = layer.layers[i];
            lyr.__parent = layer.id;
            if (lyr.layers) {
                flatten(lyr, list);
            } else {
                list.push(lyr);
            }
        }
        return list;
    };

    // Get a flattened list of layer objects
    var list = flatten(layers, []);
    // Lookup id on layer.id to track the enabled state of parent layers
    var enabled = {};

    // Walk the flattened tree backwards, if any children are enabled then
    // enable their parent
    for (var i = list.length, lyr; i--; ) {
        lyr = list[i];
        if (lyr["layers"]) lyr.enabled = enabled[lyr.id] || false;
        if (lyr["enabled"]) enabled[lyr.__parent] = true;
        delete lyr.__parent;
    }

    return layers;

}
