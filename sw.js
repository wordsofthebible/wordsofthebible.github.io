importScripts('https://unpkg.com/typescript@4.5.4/lib/typescriptServices.js')

const handleTs = async (req) => {
  const res = await fetch(req);
  const text = await res.text();
  console.log('Compiling...', req.url)
  const replaced = compile(req.url, text);
  console.log('Compiled', req.url)
  const headers = new Headers(res.headers);
  headers.set('Content-Type', 'application/javascript');
  return new Response(replaced, {headers, status: 200, statusText: 'OK'});
}

const compile = (url, str) => {
  let replaced = 'console.error("Failed to compile ts module")';
  try {
    console.time('Compiling')
    const output = ts.transpileModule(str, {
      compilerOptions: {
        target: "ES2020",
        module: "ES2020",
        sourceMap: true,
      }
    });
    replaced = output.outputText;
    const sourceMap = JSON.parse(output.sourceMapText);
    sourceMap.file = new URL(url).pathname;
    sourceMap.sources = [sourceMap.file + '.orig'];
    replaced += "\n//# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap));
    console.timeEnd('Compiling');
  } catch (e) {
    console.error(e);
    replaced = 'throw new Error("Failed to compile ts module: ' + e.message + '")';
  }

  return replaced;
}

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  console.log('got url', event.request.url);
  if (url.pathname.endsWith('.ts')) {
    event.respondWith(handleTs(event.request));
  }
  if (url.pathname.endsWith('.orig')) {
    console.log('test')
  }
});
