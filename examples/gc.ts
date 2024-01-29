import { WhisperModel, manager } from "../dist";

const fp = manager.resolve("tiny");

(async () => {
	for (let i = 0; i < 5; i++) {
		await scope();
		global.gc?.();
	}
})();

async function scope() {
	const model = await WhisperModel.load(fp);
	console.log(model.handle);
}
