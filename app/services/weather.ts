import {
	CloudFogIcon,
	CloudIcon,
	CloudLightningIcon,
	CloudMoonIcon,
	CloudRainIcon,
	CloudSunIcon,
	CloudSunRainIcon,
	CloudyIcon,
	MoonIcon,
	SnowflakeIcon,
	SunIcon,
} from "lucide-react";

export const weatherIconList = {
	"01d": SunIcon,
	"01n": MoonIcon,
	"02d": CloudSunIcon,
	"02n": CloudMoonIcon,
	"03d": CloudIcon,
	"03n": CloudIcon,
	"04d": CloudyIcon,
	"04n": CloudyIcon,
	"09d": CloudRainIcon,
	"10d": CloudSunRainIcon,
	"11d": CloudLightningIcon,
	"13d": SnowflakeIcon,
	"50d": CloudFogIcon,
} as const;
