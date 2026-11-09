import { budgetTotal, makeReference, minDonation } from './logic'
import type { Campaign, Comment, Donation, Notification, PaymentMethod, User } from './types'

/** All sample dates hang off this fixed day so server and client render the same markup. */
export const SEED_NOW = Date.UTC(2026, 10, 1)
const day = (offset: number) => new Date(SEED_NOW + offset * 86_400_000).toISOString()

export const DEMO_PASSWORD = 'demo1234'

export const SEED_USERS: User[] = [
  {
    id: 'u-amara',
    name: 'Amara Okafor',
    email: 'amara@demo.fundafrica.app',
    password: DEMO_PASSWORD,
    country: 'Nigeria',
    bio: 'Nurse in Enugu. Organises the Ugwuoba clinic fund.',
    joinedAt: day(-210),
    demo: true,
  },
  {
    id: 'u-kamau',
    name: 'Joseph Kamau',
    email: 'joseph@demo.fundafrica.app',
    password: DEMO_PASSWORD,
    country: 'Kenya',
    bio: 'Teacher and borehole committee treasurer near Kitui.',
    joinedAt: day(-190),
    demo: true,
  },
  {
    id: 'u-esi',
    name: 'Esi Mensah',
    email: 'esi@demo.fundafrica.app',
    password: DEMO_PASSWORD,
    country: 'Ghana',
    bio: 'Cooperative secretary, Tamale shea collective.',
    joinedAt: day(-160),
    demo: true,
  },
  {
    id: 'u-thandi',
    name: 'Thandi Nkosi',
    email: 'thandi@demo.fundafrica.app',
    password: DEMO_PASSWORD,
    country: 'South Africa',
    bio: 'Runs an after-school reading room in Soweto.',
    joinedAt: day(-150),
    demo: true,
  },
  {
    id: 'u-guest',
    name: 'Demo Visitor',
    email: 'visitor@demo.fundafrica.app',
    password: DEMO_PASSWORD,
    country: 'Nigeria',
    bio: 'A shared demo account for trying the app out.',
    joinedAt: day(-30),
    demo: true,
  },
]

type CampaignSeed = Omit<Campaign, 'seed'>

export const SEED_CAMPAIGNS: CampaignSeed[] = [
  {
    id: 'ugwuoba-clinic-solar',
    title: 'Solar power and a vaccine fridge for Ugwuoba Health Centre',
    summary:
      'The clinic loses power for most of the week. Vaccines spoil and night deliveries happen by phone torch. This fund buys panels, batteries and a medical fridge.',
    story: [
      'Ugwuoba Health Centre serves about nine villages outside Enugu. The grid reaches it for a few hours on good days. On bad days the vaccine fridge warms up and the stock has to be thrown away.',
      'The nurses have priced a small solar system: eight panels, a battery bank sized for a night of deliveries, and a fridge rated for vaccines. Quotes from two installers are attached to the budget below.',
      'Every line of the budget is a quote or a receipt we will publish. If we raise more than the goal, the surplus goes to a maintenance fund that is also listed here, not kept quietly.',
    ],
    category: 'health',
    country: 'Nigeria',
    place: 'Ugwuoba, Enugu State',
    currency: 'NGN',
    organizerId: 'u-amara',
    createdAt: day(-62),
    deadline: day(48),
    budget: [
      { id: 'b1', label: 'Eight solar panels with mounting', amount: 1_450_000 },
      { id: 'b2', label: 'Battery bank and inverter', amount: 1_900_000 },
      { id: 'b3', label: 'Vaccine and medicine fridge', amount: 820_000 },
      { id: 'b4', label: 'Installation and wiring', amount: 380_000 },
      { id: 'b5', label: 'Two years of maintenance reserve', amount: 250_000 },
    ],
    milestones: [
      { id: 'm1', title: 'Fridge ordered', at: 820_000, note: 'The vaccine fridge is paid for first, because spoiled stock is the costliest loss.' },
      { id: 'm2', title: 'Panels and inverter bought', at: 3_000_000, note: 'Installers are booked once panels and batteries are paid.' },
      { id: 'm3', title: 'System switched on', at: 4_800_000, note: 'Installation, wiring and the maintenance reserve.' },
    ],
    updates: [
      {
        id: 'up1',
        date: day(-21),
        title: 'Two installer quotes in hand',
        body: 'We now have written quotes from installers in Enugu and Nsukka. The lower one is used in the budget. Both PDFs are with the clinic committee.',
      },
      {
        id: 'up2',
        date: day(-6),
        title: 'Fridge supplier confirmed',
        body: 'The supplier will hold the fridge price for 30 days. Once the first milestone is reached we pay the deposit and post the receipt here.',
      },
    ],
  },
  {
    id: 'kitui-borehole-repair',
    title: 'Repair the Mwingi Road borehole before the dry season',
    summary:
      'Four hundred households collect water from one borehole whose pump failed in August. The committee needs a new pump, pipework and a fenced tap stand.',
    story: [
      'The borehole on Mwingi Road was dug in 2014. Its pump failed in August and the nearest alternative is a river eleven kilometres away. Families are paying for water by the jerrycan from trucks.',
      'The water committee has a plumber, a pump supplier and a signed list of users who will pay a monthly tariff after repair to keep it running. The tariff is already agreed and written into the budget.',
    ],
    category: 'water',
    country: 'Kenya',
    place: 'Mwingi Road, Kitui County',
    currency: 'KES',
    organizerId: 'u-kamau',
    createdAt: day(-40),
    deadline: day(26),
    budget: [
      { id: 'b1', label: 'Submersible pump and controller', amount: 185_000 },
      { id: 'b2', label: 'Pipework and storage tank', amount: 96_000 },
      { id: 'b3', label: 'Fenced tap stand with six taps', amount: 64_000 },
      { id: 'b4', label: 'Plumber and labour', amount: 35_000 },
    ],
    milestones: [
      { id: 'm1', title: 'Pump ordered', at: 185_000, note: 'The pump is the longest wait, so it is bought first.' },
      { id: 'm2', title: 'Water flowing', at: 380_000, note: 'Pipework, tank, tap stand and labour.' },
    ],
    updates: [
      {
        id: 'up1',
        date: day(-12),
        title: 'Users signed the tariff list',
        body: '312 of 400 households signed. The tariff will be KSh 20 per jerrycan, collected by the committee treasurer and reported monthly.',
      },
    ],
  },
  {
    id: 'tamale-shea-press',
    title: 'A cold-press and drying shed for the Tamale shea collective',
    summary:
      'Forty women process shea by hand and lose a third of each harvest to damp. A covered drying shed and a press raise yield and income.',
    story: [
      'The collective sells shea butter in the Tamale market. Today the nuts dry on tarps, and rain in the harvest weeks ruins part of each batch. Hand pressing is slow and uneven.',
      'A roofed drying shed with racks, a small hydraulic press and food-grade storage tubs would let members process steadily through the season. The cooperative committee has costed each part with local suppliers.',
    ],
    category: 'business',
    country: 'Ghana',
    place: 'Tamale, Northern Region',
    currency: 'GHS',
    organizerId: 'u-esi',
    createdAt: day(-33),
    deadline: day(55),
    budget: [
      { id: 'b1', label: 'Roofed drying shed and racks', amount: 14_500 },
      { id: 'b2', label: 'Hydraulic press', amount: 18_000 },
      { id: 'b3', label: 'Storage tubs and packaging', amount: 4_200 },
      { id: 'b4', label: 'Training for 40 members', amount: 3_300 },
    ],
    milestones: [
      { id: 'm1', title: 'Shed built', at: 14_500, note: 'Work starts once the first line is funded.' },
      { id: 'm2', title: 'Press installed', at: 32_500, note: 'Press ordered after the shed is up.' },
      { id: 'm3', title: 'Training done', at: 40_000, note: 'Everything delivered and members trained.' },
    ],
    updates: [],
  },
  {
    id: 'soweto-reading-room',
    title: 'Books and desks for the Mofolo reading room',
    summary:
      'An after-school room for sixty children needs shelving, a year of books and lighting that works through load-shedding.',
    story: [
      'Thandi has run the reading room from a church hall since 2022. Sixty children come after school for homework help and quiet. The books are donated and mismatched, and the lights fail when the power does.',
      'This fund buys age-graded readers, shelving, six trestle desks and rechargeable lanterns. Every purchase is listed so donors can see what goes on the shelf.',
    ],
    category: 'education',
    country: 'South Africa',
    place: 'Mofolo, Soweto',
    currency: 'ZAR',
    organizerId: 'u-thandi',
    createdAt: day(-27),
    deadline: day(33),
    budget: [
      { id: 'b1', label: 'Graded readers, ages 6 to 13', amount: 22_000 },
      { id: 'b2', label: 'Shelving and six desks', amount: 12_500 },
      { id: 'b3', label: 'Rechargeable lanterns', amount: 4_500 },
      { id: 'b4', label: 'Part-time helper, six months', amount: 15_000 },
    ],
    milestones: [
      { id: 'm1', title: 'Shelves and desks', at: 12_500, note: 'Furniture first so books have a home.' },
      { id: 'm2', title: 'Books ordered', at: 34_500, note: 'The full reading set is bought.' },
      { id: 'm3', title: 'Helper hired', at: 54_000, note: 'Paid helper for six months.' },
    ],
    updates: [
      { id: 'up1', date: day(-9), title: 'Reading levels assessed', body: 'Volunteers tested all sixty children. The book list is now matched to their levels.' },
    ],
  },
  {
    id: 'gulu-seed-bank',
    title: 'A community seed bank for Gulu smallholders',
    summary:
      'Farmers sell their best seed after harvest and then buy poor seed back at planting. A shared store breaks that cycle.',
    story: [
      'Smallholders around Gulu often sell their strongest maize and bean seed because they need cash. By planting time they buy mixed grain at higher prices, and yields fall.',
      'A lockable store with moisture control lets the group keep seed through the lean months and lend it at planting, repaid in kind after harvest. The loan rule is written in the group constitution, which we will upload.',
    ],
    category: 'farming',
    country: 'Uganda',
    place: 'Gulu District',
    currency: 'UGX',
    organizerId: 'u-kamau',
    createdAt: day(-18),
    deadline: day(70),
    budget: [
      { id: 'b1', label: 'Seed store building', amount: 9_800_000 },
      { id: 'b2', label: 'Moisture meters and sealed bins', amount: 3_100_000 },
      { id: 'b3', label: 'First-year opening stock', amount: 6_500_000 },
    ],
    milestones: [
      { id: 'm1', title: 'Store built', at: 9_800_000, note: 'Construction by local builders.' },
      { id: 'm2', title: 'Stocked and open', at: 19_400_000, note: 'Equipment and opening stock bought.' },
    ],
    updates: [],
  },
  {
    id: 'kigali-lab-benches',
    title: 'Laboratory benches for a Kicukiro secondary school',
    summary:
      'Three hundred students share one working bench. Eight new benches and basic glassware make practicals possible.',
    story: [
      'The science teachers at this school already follow the national practicals list, but only one bench works. Most experiments are demonstrated, not done.',
      'Benches are made by a local carpenter and the glassware list comes from the curriculum. The school will publish bench photographs and the carpenter invoice.',
    ],
    category: 'education',
    country: 'Rwanda',
    place: 'Kicukiro, Kigali',
    currency: 'RWF',
    organizerId: 'u-guest',
    createdAt: day(-14),
    deadline: day(62),
    budget: [
      { id: 'b1', label: 'Eight laboratory benches', amount: 2_400_000 },
      { id: 'b2', label: 'Glassware and safety goggles', amount: 900_000 },
      { id: 'b3', label: 'Chemicals for one year', amount: 450_000 },
    ],
    milestones: [
      { id: 'm1', title: 'Benches ordered', at: 2_400_000, note: 'Carpenter starts work.' },
      { id: 'm2', title: 'Lab equipped', at: 3_750_000, note: 'Glassware, goggles and chemicals delivered.' },
    ],
    updates: [],
  },
  {
    id: 'addis-mothers-room',
    title: 'A mothers and babies room at the Merkato market',
    summary:
      'Traders carry infants through a crowded market all day. A clean, shaded room gives them a place to feed and rest.',
    story: [
      'Hundreds of women trade at Merkato with babies on their backs. There is nowhere clean and shaded to feed an infant or change a nappy.',
      'The market association has agreed a corner of the covered area, free for the room. The fund covers walls, a roof extension, washable flooring, a handwash basin and furniture.',
    ],
    category: 'community',
    country: 'Ethiopia',
    place: 'Merkato, Addis Ababa',
    currency: 'ETB',
    organizerId: 'u-guest',
    createdAt: day(-8),
    deadline: day(80),
    budget: [
      { id: 'b1', label: 'Walls, roof extension and flooring', amount: 310_000 },
      { id: 'b2', label: 'Handwash basin and water tank', amount: 85_000 },
      { id: 'b3', label: 'Chairs, mats and changing tables', amount: 60_000 },
    ],
    milestones: [
      { id: 'm1', title: 'Room built', at: 310_000, note: 'The structure is completed first.' },
      { id: 'm2', title: 'Room open', at: 455_000, note: 'Water and furniture installed.' },
    ],
    updates: [],
  },
  {
    id: 'lagos-bikes-riders',
    title: 'Safety gear and helmets for 120 Lagos delivery riders',
    summary:
      'Most riders work without a helmet or reflective vest. A bulk purchase from a certified maker brings the unit cost down.',
    story: [
      'A riders association in Surulere asked its members what would help most. Helmets and high-visibility vests came first.',
      'The association will buy 120 sets in one order, with riders repaying a small deposit that goes back into the next batch. The order and deposits will be shown in the updates.',
    ],
    category: 'community',
    country: 'Nigeria',
    place: 'Surulere, Lagos',
    currency: 'NGN',
    organizerId: 'u-amara',
    createdAt: day(-47),
    deadline: day(12),
    budget: [
      { id: 'b1', label: '120 certified helmets', amount: 1_320_000 },
      { id: 'b2', label: '120 reflective vests', amount: 360_000 },
      { id: 'b3', label: 'Fitting day and first-aid training', amount: 180_000 },
    ],
    milestones: [
      { id: 'm1', title: 'Helmets ordered', at: 1_320_000, note: 'Bulk order placed.' },
      { id: 'm2', title: 'Riders equipped', at: 1_860_000, note: 'Vests and training done.' },
    ],
    updates: [
      { id: 'up1', date: day(-15), title: 'Helmet maker quote', body: 'The maker confirmed the price for 120 units with delivery in three weeks.' },
    ],
  },
]

/** Share of the goal already raised in the sample data, and how many gifts it came in. */
const PROGRESS: Record<string, [number, number]> = {
  'ugwuoba-clinic-solar': [0.46, 31],
  'kitui-borehole-repair': [0.71, 44],
  'tamale-shea-press': [0.34, 22],
  'soweto-reading-room': [0.58, 37],
  'gulu-seed-bank': [0.21, 14],
  'kigali-lab-benches': [0.4, 19],
  'addis-mothers-room': [0.09, 6],
  'lagos-bikes-riders': [0.88, 52],
}

const DONOR_NAMES = [
  'Chidi Eze', 'Wanjiru Mwangi', 'Kofi Boateng', 'Naledi Dlamini', 'Ibrahim Musa', 'Grace Akello',
  'Tendai Moyo', 'Fatima Bello', 'Samuel Otieno', 'Abena Owusu', 'Lindiwe Zulu', 'Emeka Nwosu',
  'Mercy Chebet', 'Yaw Darko', 'Zanele Khumalo', 'Halima Yusuf', 'Daniel Kiprop', 'Adwoa Asante',
  'Peter Ssemakula', 'Ngozi Obi', 'Aisha Diallo', 'Moses Banda', 'Selam Tesfaye', 'Uche Anozie',
]

const NOTES = [
  'Proud of this community.', 'For the children.', 'Keep us posted on the receipts.', 'Small gift, big hopes.',
  'Sharing this with my family.', 'Thank you for publishing the budget.', 'Happy to help.', '',
  '', '', 'In memory of my grandmother.', 'From a neighbour two villages over.',
]

function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

const METHODS: PaymentMethod[] = ['card', 'mobile_money', 'bank_transfer', 'mobile_money']

function buildDonations(): Donation[] {
  const all: Donation[] = []
  for (const c of SEED_CAMPAIGNS) {
    const [frac, count] = PROGRESS[c.id]
    const rand = rng(hash(c.id))
    const goal = budgetTotal(c.budget)
    const target = goal * frac
    const weights = Array.from({ length: count }, () => 0.25 + rand() * rand() * 3)
    const sum = weights.reduce((a, b) => a + b, 0)
    const step = minDonation(c.currency)
    const span = Math.max(1, (SEED_NOW - new Date(c.createdAt).getTime()) / 86_400_000)
    weights.forEach((w, i) => {
      const raw = (w / sum) * target
      const amount = Math.max(step, Math.round(raw / step) * step)
      const anonymous = rand() < 0.2
      const name = DONOR_NAMES[Math.floor(rand() * DONOR_NAMES.length)]
      const when = new Date(c.createdAt).getTime() + ((i + rand()) / count) * span * 86_400_000
      all.push({
        id: `d-${c.id}-${i}`,
        campaignId: c.id,
        donorId: null,
        name: anonymous ? 'Anonymous' : name,
        anonymous,
        amount,
        currency: c.currency,
        message: NOTES[Math.floor(rand() * NOTES.length)],
        method: METHODS[Math.floor(rand() * METHODS.length)],
        reference: makeReference(hash(`${c.id}${i}`)),
        createdAt: new Date(when).toISOString(),
      })
    })
  }
  return all
}

export const SEED_DONATIONS: Donation[] = buildDonations()

export const SEED_COMMENTS: Comment[] = [
  { id: 'c1', campaignId: 'ugwuoba-clinic-solar', userId: 'u-kamau', name: 'Joseph Kamau', body: 'Can you share which installer quote you used? Our centre is looking at the same setup.', createdAt: day(-30) },
  { id: 'c2', campaignId: 'ugwuoba-clinic-solar', userId: 'u-amara', name: 'Amara Okafor', body: 'Yes. The Enugu quote is the lower one and is attached to the clinic committee file. I will post the PDF in the next update.', createdAt: day(-29) },
  { id: 'c3', campaignId: 'kitui-borehole-repair', userId: 'u-esi', name: 'Esi Mensah', body: 'Good to see the tariff agreed before the repair. That is what keeps pumps running.', createdAt: day(-10) },
  { id: 'c4', campaignId: 'soweto-reading-room', userId: 'u-guest', name: 'Demo Visitor', body: 'Which reading levels are you short of most?', createdAt: day(-7) },
  { id: 'c5', campaignId: 'soweto-reading-room', userId: 'u-thandi', name: 'Thandi Nkosi', body: 'Mostly ages 6 to 8. The graded readers line covers those first.', createdAt: day(-6) },
  { id: 'c6', campaignId: 'lagos-bikes-riders', userId: 'u-thandi', name: 'Thandi Nkosi', body: 'Will riders get a say in the helmet size and colour?', createdAt: day(-12) },
]

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u-amara', text: 'Your campaign "Solar power and a vaccine fridge" passed 40% funded.', href: '/campaign/ugwuoba-clinic-solar', createdAt: day(-5), read: false },
  { id: 'n2', userId: 'u-amara', text: 'Joseph Kamau commented on your campaign.', href: '/campaign/ugwuoba-clinic-solar', createdAt: day(-30), read: true },
  { id: 'n3', userId: 'u-guest', text: 'Welcome to the demo. Try giving a gift or starting a campaign.', href: '/explore', createdAt: day(-1), read: false },
]
