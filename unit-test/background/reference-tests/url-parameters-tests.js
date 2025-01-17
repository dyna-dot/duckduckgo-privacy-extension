const Site = require('../../../shared/js/background/classes/site.es6')
const tds = require('../../../shared/js/background/trackers.es6')
const tdsStorageStub = require('../../helpers/tds.es6')
const tdsStorage = require('../../../shared/js/background/storage/tds.es6')

const config = require('../../data/reference-tests/url-parameters/config_reference.json')
const {
    trackingParameters: { name: featureDescription, tests }
} = require('../../data/reference-tests/url-parameters/tests.json')

const {
    stripTrackingParameters,
    trackingParametersStrippingEnabled
} = require('../../../shared/js/background/url-parameters.es6')

describe(featureDescription + ': ', () => {
    beforeAll(() => {
        tdsStorageStub.stub({ config })

        return tdsStorage.getLists().then(lists => tds.setLists(lists))
    })

    for (const {
        name: testDescription, testURL: initialUrl, initiatorURL: initiatorUrl,
        expectURL: expectedUrl, exceptPlatforms: skippedPlatforms = []
    } of tests) {
        if (skippedPlatforms.includes('web-extension')) {
            continue
        }

        it(testDescription, () => {
            // stripTrackingParameters returns true if any parameters were
            // removed.
            const expectedResult = expectedUrl.length < initialUrl.length

            const urlObject = new URL(initialUrl)
            const stripResult = trackingParametersStrippingEnabled(
                new Site(initialUrl), initiatorUrl
            ) && stripTrackingParameters(urlObject)
            const strippedUrl = urlObject.href

            expect(stripResult).toEqual(expectedResult)
            expect(strippedUrl).toEqual(expectedUrl)
        })
    }
})
