module.exports = {
	apps: [
		{
			name: "remix-weather",
			script: "npm",
			args: "start",
			autorestart: true,
			watch: false,
			env: {
				WEATHER_API_KEY: process.env.WEATHER_API_KEY,
				THEME_SECRET: process.env.THEME_SECRET,
			},
		},
	],
};
