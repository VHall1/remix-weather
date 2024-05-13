import {
	CloudFogIcon,
	CloudIcon,
	CloudLightningIcon,
	CloudRainIcon,
	CloudSunIcon,
	CloudSunRainIcon,
	CloudyIcon,
	SnowflakeIcon,
	SunIcon,
} from "lucide-react";

export const weatherIconList = {
	"01d": SunIcon,
	"02d": CloudSunIcon,
	"03d": CloudIcon,
	"04d": CloudyIcon,
	"09d": CloudRainIcon,
	"10d": CloudSunRainIcon,
	"11d": CloudLightningIcon,
	"13d": SnowflakeIcon,
	"50d": CloudFogIcon,
} as const;
