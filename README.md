# hn-offline-services

## Notes
`dom` is included as a lib in `tsconfig.json` due to an issue with the `firebase` package. The issue is described in more detail at https://stackoverflow.com/questions/51073986/cannot-find-name-serviceworkerregistration-error-when-creating-a-firebase-cl.

Attempts to incorporate `webpack` have failed. Consider reviewing the commit history to see the various configurations that did not work. Simple functions operated without issue, but functions with Firebase functionality fail. The issue appeared to be caused by async/await functionality, but Promises in general had issues.

At some point in the future, `dom` should be removed as a library. Additionally, `webpack` should be included. `webpack` is important due to its ability to reduce bundle sizes and streamline code generation. The bundle size without webpack is ~16MB for ANY function. With webpack, the `hello` function drops to ~3KB while hn-api drops to ~350KB.
