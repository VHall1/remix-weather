import { LRUCache } from "lru-cache";
import { type CacheEntry, type Cache, totalTtl } from "@epic-web/cachified";

export function makeCache() {
	const lruInstance = new LRUCache<string, CacheEntry>({ max: 1000 });
	const lru: Cache = {
		set(key, value) {
			const ttl = totalTtl(value?.metadata);
			return lruInstance.set(key, value, {
				ttl: ttl === Infinity ? undefined : ttl,
				start: value?.metadata?.createdTime,
			});
		},
		get(key) {
			return lruInstance.get(key);
		},
		delete(key) {
			return lruInstance.delete(key);
		},
	};
	return lru;
}
