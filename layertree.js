/** @jsx React.DOM */

var LayerItem = React.createClass({
    _onChange: function() {
        var layer = this.props.layer;
        layer.enabled = this.refs.checkbox.getDOMNode().checked;
        this.props.onLayerChange(layer);
    },
    render: function() {
        var layerList = null;
        if (this.props.layer.layers) {
            var layerNodes = this.props.layer.layers.map(function(layer) {
                return <LayerItem layer={layer} key={layer.id} onLayerChange={this.props.onLayerChange} />;
            }.bind(this));
            layerList = (
                <ul className="layerItem">
                {layerNodes}
                </ul>
            );
        }
        return (
            <li className="layerItem">
                <input type="checkbox" checked={this.props.layer.enabled}
                    id={this.props.layer.id} key={this.props.layer.id}
                    onChange={this._onChange} ref="checkbox" />
                <label htmlFor={this.props.layer.id}>{this.props.layer.name}</label>
                {layerList}
            </li>
        );
    }
});

var LayerTree = React.createClass({
    getInitialState: function() {
        return {layer: {id: "", layers: null}};
    },
    componentWillMount: function() {
        this.setState({layer: syncParents(this.props.layer)});
    },
    _onLayerChange: function(changedLayer) {
        var layer = findLayer(this.props.layer, changedLayer.id);
        layer.enabled = changedLayer.enabled;
        syncChildren(layer);
        this.setState(syncParents(this.props.layer));
        this.props.onChange(this.props.layer);
    },
    render: function() {
        return (
            <ul className="layerTree">
                <LayerItem layer={this.props.layer} onLayerChange={this._onLayerChange} />
            </ul>
        );
    }
});
