const config = require('../../webpack.shared')(__dirname);
module.exports = {
	...config,
	output: {
		...config.output,
		library: '@piotrmitrega/react-diagrams-geometry'
	}
};
