/**
 * this file is not really intended to be run!
 *
 * it's just a list of scripts that I (the module dev, shemetz) sometimes run in console, to check for errors in sheets or in my code.
 */

export const shemetzConsoleCode = async () => {
  const packIdsForData = [
    'pf2e.abomination-vaults-bestiary',
    'pf2e.age-of-ashes-bestiary',
    'pf2e.agents-of-edgewatch-bestiary',
    'pf2e.battlecry-bestiary',
    'pf2e.book-of-the-dead-bestiary',
    'pf2e.blood-lords-bestiary',
    'pf2e.claws-of-the-tyrant-bestiary',
    'pf2e.curtain-call-bestiary',
    'pf2e.extinction-curse-bestiary',
    'pf2e.fall-of-plaguestone-bestiary',
    'pf2e.fists-of-the-ruby-phoenix-bestiary',
    'pf2e.howl-of-the-wild-bestiary',
    'pf2e.gatewalkers-bestiary',
    'pf2e.lost-omens-bestiary',
    'pf2e.malevolence-bestiary',
    'pf2e.menace-under-otari-bestiary',
    'pf2e.outlaws-of-alkenstar-bestiary',
    'pf2e.kingmaker-bestiary',
    'pf2e.pathfinder-monster-core',
    'pf2e.pathfinder-monster-core-2',
    'pf2e.pathfinder-npc-core',
    'pf2e.pathfinder-dark-archive',
    'pf2e.prey-for-death-bestiary',
    'pf2e.quest-for-the-frozen-flame-bestiary',
    'pf2e.revenge-of-the-runelords-bestiary',
    'pf2e.rusthenge-bestiary',
    'pf2e.season-of-ghosts-bestiary',
    'pf2e.seven-dooms-for-sandpoint-bestiary',
    'pf2e.shadows-at-sundown-bestiary',
    'pf2e.sky-kings-tomb-bestiary',
    'pf2e.spore-war-bestiary',
    'pf2e.strength-of-thousands-bestiary',
    'pf2e.the-enmity-cycle-bestiary',
    'pf2e.the-slithering-bestiary',
    'pf2e.triumph-of-the-tusk-bestiary',
    'pf2e.troubles-in-otari-bestiary',
    'pf2e.myth-speaker-bestiary',
    'pf2e.night-of-the-gray-death-bestiary',
    'pf2e.crown-of-the-kobold-king-bestiary',
    'pf2e.shades-of-blood-bestiary',
    'pf2e.stolen-fate-bestiary',
    'pf2e.rage-of-elements-bestiary',
    'pf2e.wardens-of-wildwood-bestiary',
    'pf2e.war-of-immortals-bestiary',
  ]
  const myStats = { _total: 0 }
  const examples = {}
  const literallyEveryNpc = []
  for (const packId of packIdsForData) {
    const pack = game.packs.get(packId)
    console.log(`---CHECKING PACK ${packId}... ---`)
    await pack.getIndex()
    for (const ic of pack.index.contents) {
      const npc = await fromUuid(ic.uuid)
      if (npc.type !== 'npc') continue
      const warnings = PF2E_SEE_SIMPLE_SCALE_STATISTICS.judgeNpcStatisticsByGuidelines(npc)
      if (warnings.length > 0) {
        for (const w of warnings) {
          myStats[w.id] = (myStats?.[w.id] ?? 0) + 1
          examples[w.id] = (examples?.[w.id] ?? []).concat(`${npc.name} (${pack.metadata.label}) | ${w.directText}`)
        }
      }
      if (warnings.length > 4) {
        console.log(`wow, ${warnings.length} warnings for ${npc.name}!`)
      }
      literallyEveryNpc.push(npc)
      myStats._total += 1
    }
  }
  console.log('-----DONE-----')

  const sortedByKey = (unordered) => Object.keys(unordered)
    .sort() // Sort the keys alphabetically
    .reduce((obj, key) => {
      obj[key] = unordered[key] // Rebuild the object with sorted keys
      return obj
    }, {})

  self.myStats = sortedByKey(myStats)
  self.examples = sortedByKey(examples)
  self.literallyEveryNpc = literallyEveryNpc
}

// then do stuff like this
/*
literallyEveryNpc.filter(npc => {
    const scale = PF2E_SEE_SIMPLE_SCALE_STATISTICS.getSimpleScale(npc.system.attributes.hp.max, npc.level, "hp")
    return scale === "High" || scale === "Extreme"
}).length
// 931 (=22% of all NPCs have high or extreme hp)

 */

//noinspection JSUnusedLocalSymbols
const _latestStats = {
  '_total': 4184,

  'all-high-defenses': 10,
  'broad-resistance-and-high-hp': 22,
  'extreme-ac-at-low-level': 40,
  'extreme-statistic-without-low': 63,
  'fly-speed-at-low-level': 42,
  'high-ac-and-hp': 27,
  'high-attack-and-damage': 61,
  'higher-than-extreme-ac': 2,
  'higher-than-extreme-attack': 4,
  'higher-than-extreme-fortitude': 3,
  'higher-than-extreme-perception': 7,
  'higher-than-extreme-reflex': 1,
  'higher-than-extreme-will': 7,
  'lower-than-terrible-ac': 13,
  'lower-than-terrible-attack': 4,
  'lower-than-terrible-fortitude': 5,
  'lower-than-terrible-perception': 8,
  'lower-than-terrible-reflex': 8,
  'lower-than-terrible-will': 22,
  'missing-imm-or-res-cold': 2,
  'missing-imm-or-res-fear': 11,
  'missing-imm-or-res-fire': 4,
  'missing-immunity-death-effects': 1,
  'missing-immunity-fire': 2,
  'missing-immunity-precision': 6,
  'missing-resistance-poison': 0,
  'missing-resistance-precision': 0,
  'missing-trait-fiend': 3,
  'missing-trait-holy': 5,
  'missing-trait-monitor': 2,
  'missing-trait-unholy': 76,
  'missing-weakness-cold-iron': 42,
  'missing-weakness-holy': 56,
  'missing-weakness-unholy': 14,
  'missing-wood-weaknesses': 4,
  'more-than-one-extreme-save': 18,
  'no-high-statistics-at-least-one-low': 157,
  'no-low-statistics-at-all': 397,
  'ooze-ac-not-terrible': 8,
  'ranged-strike-with-extreme-damage': 15,
  'swarm-hp-not-low': 11,
  'three-high-defenses-no-terrible': 117,
}
