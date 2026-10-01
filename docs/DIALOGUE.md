<!-- GENERATED from PRD.md. Edit PRD.md, then npm run docs. -->

> The PRD is the foundation. [Arcade direction](ARCADE_DIRECTION_ADDENDUM.md) governs the new arcade direction, and [arcade audio](ARCADE_AUDIO_ADDENDUM.md) governs sound. This extract retains the original section for reference. Current operational instructions are in DEPLOYMENT.md; verified status is in QA_CHECKLIST.md.

## 12. Dialogue bible

> All lines live in `src/content/*.json`, tagged by `context` (scene, anger, zone, combo, hour, visit_n), picked through **no-repeat decks** (shuffle → draw → reshuffle only when exhausted, never repeating the last line across reshuffle). Two languages: **Hinglish** (default) and **English** (settings toggle, P1). Harsh must approve every line. `{cgpa}` comes from `facts.json` (example value 8.36).

### 12.1 Intro titles (random)
- IS HARSH IRRITATING YOU?
- HARSH AGAIN?
- DID HARSH JUST SAY "OK"?
- BREAKING: HARSH HAS BEEN ANNOYING.
- FEELING SLAP-HAPPY?
- HARSH HAS 99 PROBLEMS. YOU ARE ONE.
Subtitles: "We've developed a highly unnecessary solution." · "Certified by absolutely nobody." · "Violence, but make it cartoon." · "No Harsh was harmed. Several egos were."

### 12.2 Button labels
YES, EXTREMELY · YES, VERY MUCH · OBVIOUSLY · / NO, NOT REALLY · NO, I'M SUSPICIOUS · NOPE (nervous)

### 12.3 Anger results
- **A LITTLE ANNOYED:** "Adorable. Like a mosquito with feelings." · "That's it? Okay, a warm-up round." · "Chota Sher: 'We'll start with the starter pack.'" · "Fine. Gentle chaos it is."
- **PRETTY ANGRY:** "Now we're talking." · "Harsh is sweating. Good." · "Rage meter: warming up." · "Someone was ignored on WhatsApp."
- **EXTREMELY ANGRY:** "Emotional Damage unlocked. Handle with care." · "Harsh has hidden behind the desk. It won't help." · "The lion approves." · "The council has been informed."
- **BEYOND HUMAN LIMITS:** "WARNING: ENTITY IS NO LONGER HUMAN." · "Harsh has locked the door. Doors don't help." · "Both ultimates unlocked. May God have mercy on his ego." · "THE VEINS. THE VEINS ARE OUT."
- **PROVE IT result:** "Eleven taps per second. Concerning." · "Your thumb has filed a complaint." · "Wow, that's actual anger. Or you have a game controller."

### 12.4 NO path
- On NO: "Hmm. The Anger Detector disagrees." · Harsh smirks: "I knew you liked me."
- Lie detector idle: "Place finger. Tell the truth. Or at least try." · Early release: "INCONCLUSIVE. YOUR THUMB IS HIDING SOMETHING."
- Result: "LIE DETECTED. You've been irritated since the group chat." · Harsh: "…ok, that hurts."
- STILL NO: "Fine. Then you are either lying or a saint." · "Let's test the saint theory."
- Compliments (backhanded-wholesome): "He is… consistently online." · "He tries. Sometimes." · "He once made a good decision." · "His memes are mid, but they're his." · "He is helpful when he remembers." · "He has never been late to be late." · "His code compiles on the second try." · "He is a fine human. Allegedly."

### 12.5 Attack captions (3 random per attack, shown under the onomatopoeia)
- **SLAP:** "Direct hit on the ego." · "That left a mark. A hand-shaped one." · "Sound of justice." · "A slap a day keeps the attitude away." · "Spicy."
- **PUNCH:** "Right on the confidence." · "Rent-free no more." · "That was for the 'ok'." · "He felt that in the next timeline." · "Bam. Ouch. Wow."
- **CHAPPAL:** "Aaj kal ke bacche…" · "Direct from Mummy." · "Blue-strap diplomacy." · "Beta, yeh tumhare liye." · "Sandal of justice."
- **BONK:** "Hollow. Like his promises." · "Bonk on delivery." · "Go directly to bonk jail." · "Instant humility." · "That's a lot of brain noise."
- **TOMATO:** "Fresh from the mandi." · "Organic. Non-refundable." · "Farm-to-face." · "That was ripe." · "Salad for the soul."
- **THUNDER PUNCH:** "THE SKY HAS FILED A COMPLAINT." · "ZEUS WOULD LIKE A WORD." · "SCIENCE CANNOT EXPLAIN THIS."
- **EMOTIONAL DAMAGE:** "SHARMA JI KA BETA WOULD NEVER." · "Marksheet. Delivered." · "EGO.EXE HAS STOPPED RESPONDING."
- **ROAST:** "Peer reviewed." · "Get a towel." · "Citation: needed. Burn: confirmed."
- **WHIFF:** "Missed. Harsh didn't even flinch." · "Swing and a miss. Very athletic." · "The air is now in pain."

### 12.6 Harsh's reaction bubbles / comebacks
"Ow?" · "Why meeee?" · "I was just vibing." · "Arre yaar!" · "I didn't even do anything!" · "Mummy ko mat batana." · "This is a hate crime against me." · "I'll remember this at the next group project." · "Bro what." · "Ouch, but make it dramatic." · "I'm calling Chota Sher." · "That's illegal in several fictional countries." · "Did I deserve that? Probably." · "I wasn't even listening." · "Okay, that one was fair."

### 12.7 Chota Sher announcer (one line, bottom strip)
"Reporting this to Harsh." · "Nice one. I've told him." · "I am legally required to tattle." · "Combo detected. I'm writing it down." · "He knows. He knows." · "Rage full. Be careful." · "I'm a lion, not a lawyer." · "Message delivered. He's reading it." · "Meow—*cough*—ROAR." · "That one deserves its own paragraph." · "Telegram is lit."

### 12.8 Absurd warnings (HUD banners, ≤ 1 per 20 s)
- WARNING: HARSH'S EGO IS RUNNING OUT OF STORAGE.
- THIS ATTACK HAS BEEN ESCALATED TO THE SUPREME COURT.
- PLEASE WAIT WHILE HARSH PROCESSES YOUR EMOTIONAL DAMAGE.
- HARSH HAS PUSHED TO PROD ON A FRIDAY. NOBODY IS SURPRISED.
- LOW BATTERY: HARSH'S PATIENCE.
- ERROR 404: DIGNITY NOT FOUND.
- COMBO DETECTED. HARSH'S INSURANCE NOT COVERED.
- SYSTEM: HARSH HAS BEEN CONFIDENT FOR TOO LONG.

### 12.9 Verdict charges (pick 3 from stats-aware pool)
- "Excessive replying 'ok'."
- "Unauthorised levels of confidence."
- "Being technically right at the worst time."
- "Committing code on a Friday."
- "Leaving the group chat on read."
- "Walking in like he has Wi-Fi in his soul."
- "Suspicious smugness."
- "Failing to reply with a meme."
- "Having a CGPA of {cgpa} and acting like it's 10."
- "Starting five side projects and finishing two."
Verdict stamps: **GUILTY ON ALL COUNTS** · **GUILTY, BUT CUTE** · **GUILTY, AGAIN**.

### 12.10 Sentence slot machine (3 reels)
Verb: **BUY** · **DELIVER** · **PUBLICLY APOLOGISE WITH** · **SING** · **GIFT** · **WRITE** · **COOK** · **ADMIT DEFEAT WITH**
Object: **CHAI** · **SAMOSAS** · **A SORRY SONG** · **THE LAST SLICE** · **A 1000-WORD APOLOGY** · **A HANDWRITTEN NOTE** · **MEMES** · **ONE FULL-VOLUME "SORRY"**
Duration: **FOR 5 PEOPLE** · **BY MONDAY** · **FOR THE ENTIRE TRIBUNAL** · **IN THE GROUP CHAT** · **UNTIL FURTHER NOTICE** · **TODAY, WITH DRAMA** · **WITH EYE CONTACT** · **WITH A BOW**
(Examples: "BUY CHAI FOR 5 PEOPLE", "SING A SORRY SONG IN THE GROUP CHAT".)

### 12.11 Roast cards (30-card deck sample; gentle, editable)
"Harsh's 'quick fix' has its own Jira board." · "Harsh debugs with vibes." · "He opens a terminal like he's defusing a bomb." · "'It works on my machine' is his love language." · "Harsh doesn't need sleep, he needs a commit." · "He once hot-fixed a hotfix." · "Harsh names variables like he names pets: with hope." · "He joins calls to say 'can you repeat that?'" · "His to-do list has a to-do list." · "He puts 'AI' in every sentence, even 'hello'." · "He trained a model to say 'ok'." · "He took 40 minutes to say 'five minutes'." · "His Wi-Fi is his only commitment."

### 12.12 Repeat-visit lines
- 2nd visit: "Back so soon? Harsh is still bruised."
- 3rd: "A returning customer. We love loyalty."
- 5th: "At this point it's a hobby."
- 10th: "Seek help. Also, hit him again."
- 25th: "You've attacked Harsh {n} times. Chota Sher has stopped counting out of fear."
- Same day return: "Again?? He hasn't even healed."
- After midnight (local 00:00–04:59): "Why are you awake? Go to sleep. After one more slap." · Mon: "It's Monday. Harsh is already suffering. Hit him anyway." · Fri: "It's Friday. He's probably deploying."

### 12.13 Error toasts (non-blocking, funny)
- Telegram failed: "Chota Sher tripped on the way. Harsh remains blissfully unaware."
- Rate limited: "Chota Sher is on a tea break. Back in a minute."
- Offline: "No internet. Harsh is safe. Reconnect to resume the violence."
- Audio blocked: "Browser says no sound. Tap the speaker to try again."

### 12.14 Idle taunts (Harsh, 8 s idle)
"Are you gonna do something?" · "I'm waiting. Casually." · "Take your time. I have all day." · "Is this a staring contest?" · "…I'm bored. Hit me."

---


## 13. Easter eggs & surprises

| # | Trigger | Effect | Eff. |
|---|---|---|---|
| 1 | Tap Harsh's glasses 10× quickly | Glasses become heart-shaped; Harsh blushes, then recoils | S |
| 2 | Hold on his nose 2 s | Honk. Whole stage squeaks | S |
| 3 | Konami code (↑↑↓↓←→←→BA) | Disco mode: neon + chiptune + Harsh dances | M |
| 4 | Type "bruh" anywhere | Giant BRUH slams the screen + voice (if enabled) | S |
| 5 | Local time 00:00–04:59 | Harsh in pyjamas with a tiny sleep cap; "Go sleep" line | S |
| 6 | Friday | Banner: "HARSH IS PROBABLY PUSHING TO PROD"; production-down siren joke | S |
| 7 | Shake the phone (devicemotion) | Earthquake: everything falls, Harsh sways | M |
| 8 | Triple-tap Chota Sher | He roars and "bites" the screen (crack decal) | S |
| 9 | Tap footer commit hash | Fake build log scrolls: "Build failed: Harsh not found" | S |
| 10 | 3 consecutive whiffs | Harsh offers a comfort chair and pats the visitor's weapon: "It's okay." | S |
| 11 | Bonk the same spot 5× | A pimple-like bump pops with "pop" and Harsh sighs | S |
| 12 | Cursor chappal (desktop, press `C`) | Cursor becomes a spinning chappal | S |
| 13 | All 6 basics in one session | Hidden achievement toast "COLLECTOR" + golden chappal skin | S |
| 14 | Pile 6 chappals | The pile topples; Harsh slips on one | S |
| 15 | Ego exactly 1% | Harsh whispers "…please." — a heartbeat; next hit = K.O. slam | S |
| 16 | Reach K.O. without ever missing | Certificate gets "PERFECT AIM" ribbon | S |
| 17 | Visit on a configured festival date | Seasonal skin / attack swap (e.g., crackers, gulal) via `events.json` | M |
| 18 | Never attack for 60 s | Harsh walks off, sits and plays on the tiny laptop; the stage fills with idle jokes | S |
| 19 | Tap the "9.9" marksheet | It becomes "7.0". Sharma Ji's son cries | S |
| 20 | URL `?mom=1` | Phone rings, "MOM" calls Harsh at a random moment | S |
| 21 | Tap the tiny laptop prop | "Works on my machine" speech bubble | S |
| 22 | Hold SLAP for 3 s | Windmill slap | S |

---


