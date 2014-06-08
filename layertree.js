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
