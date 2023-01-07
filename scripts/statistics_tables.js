export const TABLES = {
  ABILITY_MODIFIER: {},
  PERCEPTION: {},
  SKILLS: {},
  AC: {},
  SAVES: {},
  HP: {},
  WEAKNESSES: {},
  RESISTANCES: {},
  STRIKE_ATTACK: {},
  STRIKE_DAMAGE: {},
  SPELL_DC: {},
  SPELL_ATTACK: {},
}

self.PF2E_SEE_SIMPLE_SCALE_STATISTICS = {
  TABLES,
}

export const initializeTables = () => {
// copied from:
// https://2e.aonprd.com/Rules.aspx?ID=995

// Table 2–1: Ability Modifier Scales
// Level	Extreme	High	Moderate	Low
  const TABLE_ABILITY_MODIFIER_RAW = `
–1\t—\t+3\t+2\t+0
0\t—\t+3\t+2\t+0
1\t+5\t+4\t+3\t+1
2\t+5\t+4\t+3\t+1
3\t+5\t+4\t+3\t+1
4\t+6\t+5\t+3\t+2
5\t+6\t+5\t+4\t+2
6\t+7\t+5\t+4\t+2
7\t+7\t+6\t+4\t+2
8\t+7\t+6\t+4\t+3
9\t+7\t+6\t+4\t+3
10\t+8\t+7\t+5\t+3
11\t+8\t+7\t+5\t+3
12\t+8\t+7\t+5\t+4
13\t+9\t+8\t+5\t+4
14\t+9\t+8\t+5\t+4
15\t+9\t+8\t+6\t+4
16\t+10\t+9\t+6\t+5
17\t+10\t+9\t+6\t+5
18\t+10\t+9\t+6\t+5
19\t+11\t+10\t+6\t+5
20\t+11\t+10\t+7\t+6
21\t+11\t+10\t+7\t+6
22\t+11\t+10\t+8\t+6
23\t+11\t+10\t+8\t+6
24\t+13\t+12\t+9\t+7`

  for (let line of TABLE_ABILITY_MODIFIER_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    line = line.replaceAll('\t—\t', '\t+4\t') // workaround for levels -1 and 0
    const [level, Extreme, High, Moderate, Low] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    const myDefinitionOfTerrible = Low - (Moderate - Low) - 1
    TABLES.ABILITY_MODIFIER[level] = { Extreme, High, Moderate, Low, Terrible: myDefinitionOfTerrible }
  }

// Table 2–2: Perception
// Level	Extreme	High	Moderate	Low	Terrible
  const TABLE_PERCEPTION_RAW = `
–1\t+9\t+8\t+5\t+2\t+0
0\t+10\t+9\t+6\t+3\t+1
1\t+11\t+10\t+7\t+4\t+2
2\t+12\t+11\t+8\t+5\t+3
3\t+14\t+12\t+9\t+6\t+4
4\t+15\t+14\t+11\t+8\t+6
5\t+17\t+15\t+12\t+9\t+7
6\t+18\t+17\t+14\t+11\t+8
7\t+20\t+18\t+15\t+12\t+10
8\t+21\t+19\t+16\t+13\t+11
9\t+23\t+21\t+18\t+15\t+12
10\t+24\t+22\t+19\t+16\t+14
11\t+26\t+24\t+21\t+18\t+15
12\t+27\t+25\t+22\t+19\t+16
13\t+29\t+26\t+23\t+20\t+18
14\t+30\t+28\t+25\t+22\t+19
15\t+32\t+29\t+26\t+23\t+20
16\t+33\t+30\t+28\t+25\t+22
17\t+35\t+32\t+29\t+26\t+23
18\t+36\t+33\t+30\t+27\t+24
19\t+38\t+35\t+32\t+29\t+26
20\t+39\t+36\t+33\t+30\t+27
21\t+41\t+38\t+35\t+32\t+28
22\t+43\t+39\t+36\t+33\t+30
23\t+44\t+40\t+37\t+34\t+31
24\t+46\t+42\t+38\t+36\t+32`

  for (let line of TABLE_PERCEPTION_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    const [level, Extreme, High, Moderate, Low, Terrible] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    TABLES.PERCEPTION[level] = { Extreme, High, Moderate, Low, Terrible }
  }

// Table 2–3: Skills
// Level	Extreme	High	Moderate	Low
  const TABLE_SKILLS_RAW = `
–1\t+8\t+5\t+4\t+2 to +1
0\t+9\t+6\t+5\t+3 to +2
1\t+10\t+7\t+6\t+4 to +3
2\t+11\t+8\t+7\t+5 to +4
3\t+13\t+10\t+9\t+7 to +5
4\t+15\t+12\t+10\t+8 to +7
5\t+16\t+13\t+12\t+10 to +8
6\t+18\t+15\t+13\t+11 to +9
7\t+20\t+17\t+15\t+13 to +11
8\t+21\t+18\t+16\t+14 to +12
9\t+23\t+20\t+18\t+16 to +13
10\t+25\t+22\t+19\t+17 to +15
11\t+26\t+23\t+21\t+19 to +16
12\t+28\t+25\t+22\t+20 to +17
13\t+30\t+27\t+24\t+22 to +19
14\t+31\t+28\t+25\t+23 to +20
15\t+33\t+30\t+27\t+25 to +21
16\t+35\t+32\t+28\t+26 to +23
17\t+36\t+33\t+30\t+28 to +24
18\t+38\t+35\t+31\t+29 to +25
19\t+40\t+37\t+33\t+31 to +27
20\t+41\t+38\t+34\t+32 to +28
21\t+43\t+40\t+36\t+34 to +29
22\t+45\t+42\t+37\t+35 to +31
23\t+46\t+43\t+38\t+36 to +32
24\t+48\t+45\t+40\t+38 to +33`

  for (let line of TABLE_SKILLS_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    line = line.replaceAll(' to ', '\t')
    const [level, Extreme, High, Moderate, low_upper_end, low_lower_end] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    const myDefinitionOfTerrible = low_lower_end - (low_upper_end - low_lower_end) - 1
    TABLES.SKILLS[level] = { Extreme, High, Moderate, Low: low_upper_end, Terrible: myDefinitionOfTerrible }
  }

// Table 2–5: Armor Class
// Level	Extreme	High	Moderate	Low
  const TABLE_AC_RAW = `
–1\t18\t15\t14\t12
0\t19\t16\t15\t13
1\t19\t16\t15\t13
2\t21\t18\t17\t15
3\t22\t19\t18\t16
4\t24\t21\t20\t18
5\t25\t22\t21\t19
6\t27\t24\t23\t21
7\t28\t25\t24\t22
8\t30\t27\t26\t24
9\t31\t28\t27\t25
10\t33\t30\t29\t27
11\t34\t31\t30\t28
12\t36\t33\t32\t30
13\t37\t34\t33\t31
14\t39\t36\t35\t33
15\t40\t37\t36\t34
16\t42\t39\t38\t36
17\t43\t40\t39\t37
18\t45\t42\t41\t39
19\t46\t43\t42\t40
20\t48\t45\t44\t42
21\t49\t46\t45\t43
22\t51\t48\t47\t45
23\t52\t49\t48\t46
24\t54\t51\t50\t48`

  for (let line of TABLE_AC_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    const [level, Extreme, High, Moderate, Low] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    const myDefinitionOfTerrible = Low - (Moderate - Low) - 1
    TABLES.AC[level] = { Extreme, High, Moderate, Low, Terrible: myDefinitionOfTerrible }
  }

// Table 2–6: Saving Throws
// Level	Extreme	High	Moderate	Low	Terrible
  const TABLE_SAVES_RAW = `
–1\t+9\t+8\t+5\t+2\t+0
0\t+10\t+9\t+6\t+3\t+1
1\t+11\t+10\t+7\t+4\t+2
2\t+12\t+11\t+8\t+5\t+3
3\t+14\t+12\t+9\t+6\t+4
4\t+15\t+14\t+11\t+8\t+6
5\t+17\t+15\t+12\t+9\t+7
6\t+18\t+17\t+14\t+11\t+8
7\t+20\t+18\t+15\t+12\t+10
8\t+21\t+19\t+16\t+13\t+11
9\t+23\t+21\t+18\t+15\t+12
10\t+24\t+22\t+19\t+16\t+14
11\t+26\t+24\t+21\t+18\t+15
12\t+27\t+25\t+22\t+19\t+16
13\t+29\t+26\t+23\t+20\t+18
14\t+30\t+28\t+25\t+22\t+19
15\t+32\t+29\t+26\t+23\t+20
16\t+33\t+30\t+28\t+25\t+22
17\t+35\t+32\t+29\t+26\t+23
18\t+36\t+33\t+30\t+27\t+24
19\t+38\t+35\t+32\t+29\t+26
20\t+39\t+36\t+33\t+30\t+27
21\t+41\t+38\t+35\t+32\t+28
22\t+43\t+39\t+36\t+33\t+30
23\t+44\t+40\t+37\t+34\t+31
24\t+46\t+42\t+38\t+36\t+32`

  for (let line of TABLE_SAVES_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    const [level, Extreme, High, Moderate, Low, Terrible] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    TABLES.SAVES[level] = { Extreme, High, Moderate, Low, Terrible }
  }

// Table 2–7: Hit Points
// Level	High	Moderate	Low
  const TABLE_HP_RAW = `
–1\t9-9\t8–7\t6–5
0\t20–17\t16–14\t13–11
1\t26–24\t21–19\t16–14
2\t40–36\t32–28\t25–21
3\t59–53\t48–42\t37–31
4\t78–72\t63–57\t48–42
5\t97–91\t78–72\t59–53
6\t123–115\t99–91\t75–67
7\t148–140\t119–111\t90–82
8\t173–165\t139–131\t105–97
9\t198–190\t159–151\t120–112
10\t223–215\t179–171\t135–127
11\t248–240\t199–191\t150–142
12\t273–265\t219–211\t165–157
13\t298–290\t239–231\t180–172
14\t323–315\t259–251\t195–187
15\t348–340\t279–271\t210–202
16\t373–365\t299–291\t225–217
17\t398–390\t319–311\t240–232
18\t423–415\t339–331\t255–247
19\t448–440\t359–351\t270–262
20\t473–465\t379–371\t285–277
21\t505–495\t405–395\t305–295
22\t544–532\t436–424\t329–317
23\t581–569\t466–454\t351–339
24\t633–617\t508–492\t383–367`

// TODO - hp might need to take regeneration or fast healing into account
// TODO - hp might need to take weaknesses/resistances into account
  for (let line of TABLE_HP_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    line = line.replaceAll('-', '\t')
    if (line.startsWith('\t')) line = '-' + line.substring(1)  // workaround for level -1
    // noinspection JSUnusedLocalSymbols
    const [level, high_upper, high_lower, moderate_upper, moderate_lower, low_upper, low_lower] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    const myDefinitionOfExtreme = high_upper + (high_upper - moderate_upper) + 1
    const myDefinitionOfTerrible = low_lower - (moderate_lower - low_lower) - 1
    TABLES.HP[level] = {
      Extreme: myDefinitionOfExtreme,
      High: high_lower,
      Moderate: (moderate_upper + moderate_lower) / 2,
      Low: low_upper,
      Terrible: myDefinitionOfTerrible,
    }
  }

// Table 2–8: Resistances and Weaknesses
// Level	Maximum  Minimum
  const TABLE_RESISTANCES_AND_WEAKNESSES_RAW = `
–1\t1\t1
0\t3\t1
1\t3\t2
2\t5\t2
3\t6\t3
4\t7\t4
5\t8\t4
6\t9\t5
7\t10\t5
8\t11\t6
9\t12\t6
10\t13\t7
11\t14\t7
12\t15\t8
13\t16\t8
14\t17\t9
15\t18\t9
16\t19\t9
17\t19\t10
18\t20\t10
19\t21\t11
20\t22\t11
21\t23\t12
22\t24\t12
23\t25\t13
24\t26\t13`

  for (let line of TABLE_RESISTANCES_AND_WEAKNESSES_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    // noinspection JSUnusedLocalSymbols
    const [level, maximum, minimum] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    const myDefinitionOfExtreme = maximum + 1
    const myDefinitionOfHigh = maximum
    const myDefinitionOfModerate = (maximum + minimum) / 2 // note:  may be the same as high/low
    const myDefinitionOfLow = minimum
    const myDefinitionOfTerrible = minimum - 1
    TABLES.RESISTANCES[level] = {
      Extreme: myDefinitionOfExtreme,
      High: myDefinitionOfHigh,
      Moderate: myDefinitionOfModerate,
      Low: myDefinitionOfLow,
      Terrible: myDefinitionOfTerrible,
    }
    // weaknesses are flipped - so that a high weakness is colored as "low" (because it's a negative)
    TABLES.WEAKNESSES[level] = {
      Extreme: myDefinitionOfTerrible,
      High: myDefinitionOfLow,
      Moderate: myDefinitionOfModerate,
      Low: myDefinitionOfHigh,
      Terrible: myDefinitionOfExtreme,
    }
  }

// Table 2–9: Strike Attack Bonus
// Level	Extreme	High	Moderate	Low
  const TABLE_STRIKE_ATTACK_RAW = `
–1\t+10\t+8\t+6\t+4
0\t+10\t+8\t+6\t+4
1\t+11\t+9\t+7\t+5
2\t+13\t+11\t+9\t+7
3\t+14\t+12\t+10\t+8
4\t+16\t+14\t+12\t+9
5\t+17\t+15\t+13\t+11
6\t+19\t+17\t+15\t+12
7\t+20\t+18\t+16\t+13
8\t+22\t+20\t+18\t+15
9\t+23\t+21\t+19\t+16
10\t+25\t+23\t+21\t+17
11\t+27\t+24\t+22\t+19
12\t+28\t+26\t+24\t+20
13\t+29\t+27\t+25\t+21
14\t+31\t+29\t+27\t+23
15\t+32\t+30\t+28\t+24
16\t+34\t+32\t+30\t+25
17\t+35\t+33\t+31\t+27
18\t+37\t+35\t+33\t+28
19\t+38\t+36\t+34\t+29
20\t+40\t+38\t+36\t+31
21\t+41\t+39\t+37\t+32
22\t+43\t+41\t+39\t+33
23\t+44\t+42\t+40\t+35
24\t+46\t+44\t+42\t+36`

  for (let line of TABLE_STRIKE_ATTACK_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    const [level, Extreme, High, Moderate, Low] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    const myDefinitionOfTerrible = Low - (Moderate - Low) - 1
    TABLES.STRIKE_ATTACK[level] = { Extreme, High, Moderate, Low, Terrible: myDefinitionOfTerrible }
  }

// Table 2–10: Strike Damage
// Level	Extreme	High	Moderate	Low
  const TABLE_STRIKE_DAMAGE_RAW = `
–1\t1d6+1 (4)\t1d4+1 (3)\t1d4 (3)\t1d4 (2)
0\t1d6+3 (6)\t1d6+2 (5)\t1d4+2 (4)\t1d4+1 (3)
1\t1d8+4 (8)\t1d6+3 (6)\t1d6+2 (5)\t1d4+2 (4)
2\t1d12+4 (11)\t1d10+4 (9)\t1d8+4 (8)\t1d6+3 (6)
3\t1d12+8 (15)\t1d10+6 (12)\t1d8+6 (10)\t1d6+5 (8)
4\t2d10+7 (18)\t2d8+5 (14)\t2d6+5 (12)\t2d4+4 (9)
5\t2d12+7 (20)\t2d8+7 (16)\t2d6+6 (13)\t2d4+6 (11)
6\t2d12+10 (23)\t2d8+9 (18)\t2d6+8 (15)\t2d4+7 (12)
7\t2d12+12 (25)\t2d10+9 (20)\t2d8+8 (17)\t2d6+6 (13)
8\t2d12+15 (28)\t2d10+11 (22)\t2d8+9 (18)\t2d6+8 (15)
9\t2d12+17 (30)\t2d10+13 (24)\t2d8+11 (20)\t2d6+9 (16)
10\t2d12+20 (33)\t2d12+13 (26)\t2d10+11 (22)\t2d6+10 (17)
11\t2d12+22 (35)\t2d12+15 (28)\t2d10+12 (23)\t2d8+10 (19)
12\t3d12+19 (38)\t3d10+14 (30)\t3d8+12 (25)\t3d6+10 (20)
13\t3d12+21 (40)\t3d10+16 (32)\t3d8+14 (27)\t3d6+11 (21)
14\t3d12+24 (43)\t3d10+18 (34)\t3d8+15 (28)\t3d6+13 (23)
15\t3d12+26 (45)\t3d12+17 (36)\t3d10+14 (30)\t3d6+14 (24)
16\t3d12+29 (48)\t3d12+18 (37)\t3d10+15 (31)\t3d6+15 (25)
17\t3d12+31 (50)\t3d12+19 (38)\t3d10+16 (32)\t3d6+16 (26)
18\t3d12+34 (53)\t3d12+20 (40)\t3d10+17 (33)\t3d6+17 (27)
19\t4d12+29 (55)\t4d10+20 (42)\t4d8+17 (35)\t4d6+14 (28)
20\t4d12+32 (58)\t4d10+22 (44)\t4d8+19 (37)\t4d6+15 (29)
21\t4d12+34 (60)\t4d10+24 (46)\t4d8+20 (38)\t4d6+17 (31)
22\t4d12+37 (63)\t4d10+26 (48)\t4d8+22 (40)\t4d6+18 (32)
23\t4d12+39 (65)\t4d12+24 (50)\t4d10+20 (42)\t4d6+19 (33)
24\t4d12+42 (68)\t4d12+26 (52)\t4d10+22 (44)\t4d6+21 (35)`

  for (let line of TABLE_STRIKE_DAMAGE_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    const [level, Extreme, High, Moderate, Low] = line.split('\t')
      .map(s => {
        const split = s.split(' ')
        if (split.length < 2) return parseInt(s)
        else {
          const numWithParens = split[1]
          return parseInt(numWithParens.substring(1, numWithParens.length - 1))
        }
      })
    const myDefinitionOfTerrible = Low - (Moderate - Low) - 1
    TABLES.STRIKE_DAMAGE[level] = { Extreme, High, Moderate, Low, Terrible: myDefinitionOfTerrible }
  }

// Table 2–11: Spell DC and Spell Attack Bonus
// Level	Extreme DC	Extreme Spell Attack Bonus	High DC	High Spell Attack Bonus	Moderate DC	Moderate Spell Attack Bonus
  const TABLE_SPELL_DC_AND_ATTACK_RAW = `
–1\t19\t+11\t16\t+8\t13\t+5
0\t19\t+11\t16\t+8\t13\t+5
1\t20\t+12\t17\t+9\t14\t+6
2\t22\t+14\t18\t+10\t15\t+7
3\t23\t+15\t20\t+12\t17\t+9
4\t25\t+17\t21\t+13\t18\t+10
5\t26\t+18\t22\t+14\t19\t+11
6\t27\t+19\t24\t+16\t21\t+13
7\t29\t+21\t25\t+17\t22\t+14
8\t30\t+22\t26\t+18\t23\t+15
9\t32\t+24\t28\t+20\t25\t+17
10\t33\t+25\t29\t+21\t26\t+18
11\t34\t+26\t30\t+22\t27\t+19
12\t36\t+28\t32\t+24\t29\t+21
13\t37\t+29\t33\t+25\t30\t+22
14\t39\t+31\t34\t+26\t31\t+23
15\t40\t+32\t36\t+28\t33\t+25
16\t41\t+33\t37\t+29\t34\t+26
17\t43\t+35\t38\t+30\t35\t+27
18\t44\t+36\t40\t+32\t37\t+29
19\t46\t+38\t41\t+33\t38\t+30
20\t47\t+39\t42\t+34\t39\t+31
21\t48\t+40\t44\t+36\t41\t+33
22\t50\t+42\t45\t+37\t42\t+34
23\t51\t+43\t46\t+38\t43\t+35
24\t52\t+44\t48\t+40\t45\t+37`

  for (let line of TABLE_SPELL_DC_AND_ATTACK_RAW.split('\n')) {
    if (!line) continue
    line = line.replaceAll('–', '-')
    const [level, extreme_dc, extreme_attack, high_dc, high_attack, moderate_dc, moderate_attack] = line.split('\t')
      .map(x => parseInt(x)).map(x => isNaN(x) ? null : x)
    TABLES.SPELL_DC[level] = {
      Extreme: extreme_dc,
      High: high_dc,
      Moderate: moderate_dc,
      Low: moderate_dc - (high_dc - moderate_dc) - 1,
      Terrible: moderate_dc - (high_dc - moderate_dc) * 2 - 2,
    }
    TABLES.SPELL_ATTACK[level] = {
      Extreme: extreme_attack,
      High: high_attack,
      Moderate: moderate_attack,
      Low: moderate_attack - (high_attack - moderate_attack) - 1,
      Terrible: moderate_attack - (high_attack - moderate_attack) * 2 - 2,
    }
  }
}

//
// for (const tableName of ['ABILITY_MODIFIER', 'PERCEPTION', 'SKILLS', 'AC', 'SAVES', 'HP', 'WEAKNESSES', 'RESISTANCES', 'STRIKE_ATTACK', 'STRIKE_DAMAGE', 'SPELL_DC', 'SPELL_ATTACK']) {
//   const table = PF2E_SEE_SIMPLE_SCALE_STATISTICS.TABLES[tableName]
//   const csvt = []
//   csvt.push('level\tExtreme\tHigh\tModerate\tLow\tTerrible')
//   for (let level = -1; level <= 24; level++) {
//     const bucket = table[level]
//     csvt.push(`${level}\t${bucket['Extreme']}\t${bucket['High']}\t${bucket['Moderate']}\t${bucket['Low']}\t${bucket['Terrible']}`)
//   }
//   console.log(tableName)
//   console.log(csvt.join('\n'))
// }