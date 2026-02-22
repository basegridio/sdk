import { BaseGrid } from './src/index.js'

const bg = new BaseGrid({
    apiKey: 'bg_test_815f8c401b03c13950d2cdfb50df0b09'
})

async function test() {
    try {
        console.log('🧪 Testing BaseGrid SDK...\n')

        // Add memory
        console.log('1️⃣ Adding memory...')
        const memory = await bg.add({
            agentId: 'sdk-test-bot',
            content: 'User wants to schedule meetings on Tuesdays',
            metadata: { preference: 'tuesday', type: 'scheduling' }
        })
        console.log('✅ Memory added:', memory.id)
        console.log('   Content:', memory.content)
        console.log()

        // Add another memory
        console.log('2️⃣ Adding another memory...')
        const memory2 = await bg.add({
            agentId: 'sdk-test-bot',
            content: 'User prefers video calls over phone calls',
            metadata: { preference: 'video', type: 'communication' }
        })
        console.log('✅ Memory added:', memory2.id)
        console.log()

        // Search
        console.log('3️⃣ Searching memories...')
        const results = await bg.search({
            agentId: 'sdk-test-bot',
            query: 'When does the user prefer meetings?'
        })
        console.log(`✅ Found ${results.length} results:`)
        results.forEach((r, i) => {
            console.log(`   ${i + 1}. "${r.content}"`)
            console.log(`      Similarity: ${r.similarity?.toFixed(3)}`)
            console.log(`      Combined Score: ${r.combined_score?.toFixed(3)}`)
        })
        console.log()

        // List all memories
        console.log('4️⃣ Listing all memories for agent...')
        const list = await bg.list('sdk-test-bot')
        console.log(`✅ Total memories: ${list.total}`)
        console.log()

        console.log('🎉 All tests passed!')

    } catch (error) {
        console.error('❌ Error:', error)
    }
}

test()
