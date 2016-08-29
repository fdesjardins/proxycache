import test from 'ava';
import proxycache from '../';

test('throws without options', t => {
	t.throws(() => {
		proxycache();
	});
});

test('throws without local store config', t => {
	const config = {
		cache: {
			connection: {}
		}
	};

	t.throws(() => {
		proxycache(config);
	});
});

test('throws without cache store config', t => {
	const config = {
		store: {
			connection: {}
		}
	};

	t.throws(() => {
		proxycache(config);
	});
});

test.cb('does not initialize with unknown store client name', t => {
	const config = {
		store: {
			client: 'unknown',
			connection: {}
		},
		cache: {
			client: 'gcloud',
			connection: {}
		}
	};

	proxycache(config)
		.catch(() => {
			t.pass();
			t.end();
		});
});

test.cb('does not initialize with unknown cache client name', t => {
	const config = {
		store: {
			client: 'redis',
			connection: {}
		},
		cache: {
			client: 'unknown',
			connection: {}
		}
	};

	proxycache(config)
		.catch(() => {
			t.pass();
			t.end();
		});
});
