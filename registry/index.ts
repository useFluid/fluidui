export const categories = ["Metamorph", "Characters", "Controls", "Data", "Text", "Transitions", "Splash"] as const;
export type Category = (typeof categories)[number];

export type Lang = "en" | "pt";

export const categoryLabels: Record<Lang, Record<Category, string>> = {
  en: { Metamorph: "Metamorph", Characters: "Characters", Controls: "Controls", Data: "Data", Text: "Text", Transitions: "Transitions", Splash: "Splash" },
  pt: { Metamorph: "Metamorfo", Characters: "Personagens", Controls: "Controles", Data: "Dados", Text: "Texto", Transitions: "Transições", Splash: "Splash" },
};

type Texts = {
  description: string;
  how: string;
  task: string;
};

export type Entry = Texts & {
  slug: string;
  name: string;
  category: Category;
  size: "s" | "m" | "l";
  loop?: number;
  usage: string;
  pt: Texts;
};

export const catalog: Entry[] = [
  {
    slug: "shape-morph",
    name: "Shape Morph",
    category: "Metamorph",
    size: "m",
    loop: 4.4,
    usage: `<ShapeMorph logo={logo} />`,
    description: "Flows through several shapes and lands on your logo, whatever its outline.",
    how: "The logo becomes points spread evenly along its border, and each point has a spring with a slightly different frequency. That is why the shape arrives little by little, like a liquid. Extra parts are born from a point, and at rest the exact drawing of the logo comes back.",
    task: "Use ShapeMorph with my logo. Convert its SVG with fitPath before passing it.",
    pt: {
      description: "Passa por várias formas e termina na sua logo, com qualquer contorno.",
      how: "A logo vira pontos espalhados por igual ao longo da borda, e cada ponto tem uma mola com frequência um pouco diferente. Por isso a forma chega aos poucos, como líquido. Partes a mais nascem de um ponto, e ao parar volta o desenho exato da logo.",
      task: "Use ShapeMorph com a minha logo. Converta o SVG dela com fitPath antes de passar.",
    },
  },
  {
    slug: "icon-morph",
    name: "Icon Morph",
    category: "Metamorph",
    size: "m",
    usage: `<IconMorph on={open} off={icons.menu} onIcon={icons.close} label="Menu" onClick={toggle} />`,
    description: "Icons that flow into each other: menu and close, play and pause.",
    how: "The same engine as the logo, in a 56 px button. The three menu bars become the X: one bar flows into the new shape and the other two shrink into a point. The button reports its state with aria-pressed.",
    task: "Replace the open and close, play and pause icons in my project with IconMorph.",
    pt: {
      description: "Ícones que fluem de um para o outro: menu e fechar, tocar e pausar.",
      how: "O mesmo motor da logo, num botão de 56 px. Os três traços do menu viram o X: um traço flui até a nova forma e os outros dois encolhem até sumir num ponto. O botão informa o estado com aria-pressed.",
      task: "Troque os ícones de abrir e fechar, tocar e pausar do meu projeto por IconMorph.",
    },
  },
  {
    slug: "menu-morph",
    name: "Menu Morph",
    category: "Metamorph",
    size: "m",
    usage: `<MenuMorph open={open} onOpenChange={setOpen} title="Acme" items={[{ label: "Home", href: "/" }, { label: "Orders", href: "/orders" }]} />`,
    description: "The three menu bars become the menu: the button flows into the card and each bar into a row.",
    how: "Two contours of the engine. The round button flows to the size of the card, and the three bars each stretch into a row of the menu, all on springs with slightly different frequencies. Rows beyond three are born from a point. Then the words come out of a blur, one at a time. Esc, a tap outside or choosing an item closes it, and focus goes back to the button.",
    task: "Use MenuMorph as the mobile menu of my product, with its real sections.",
    pt: {
      description: "As três barrinhas do menu viram o menu: o botão flui até virar o card e cada barra vira uma linha.",
      how: "São dois contornos do motor. O botão redondo flui até o tamanho do card, e as três barras se esticam, cada uma, até virar uma linha do menu, todas com molas de frequências um pouco diferentes. Linhas além de três nascem de um ponto. Depois as palavras entram saindo do desfoque, uma de cada vez. Esc, um toque fora ou escolher um item fecha o menu, e o foco volta ao botão.",
      task: "Use MenuMorph como o menu do meu produto no celular, com as seções reais.",
    },
  },
  {
    slug: "morph-dialog",
    name: "Morph Dialog",
    category: "Metamorph",
    size: "m",
    usage: `const [open, setOpen] = useState(false);
const [from, setFrom] = useState<HTMLElement | null>(null);

<button onClick={(e) => { setFrom(e.currentTarget); setOpen(true); }}>Open</button>
<MorphDialog open={open} onClose={() => setOpen(false)} from={from} labelledBy="title">
  <h2 id="title">Order 2041</h2>
</MorphDialog>`,
    description: "A window that flows out of the card that opened it and back into it.",
    how: "Each edge of the window is a spring with its own frequency, so one side leaves before the other and it stretches like a liquid. The corners round out with speed and land on the exact radius. The shape is a clip-path, sharp in every frame. It is the native dialog, so focus, Esc and the top layer come from the browser, and the window closes only once the shape is back home.",
    task: "Use MorphDialog for the windows in my product that open from a card or button, passing that element as from.",
    pt: {
      description: "Uma janela que flui para fora do cartão que a abriu e volta para dentro dele.",
      how: "Cada borda da janela é uma mola com frequência própria, então um lado sai antes do outro e ela estica como líquido. Os cantos arredondam com a velocidade e chegam no raio exato. A forma é um clip-path, nítida em todo quadro. É o dialog nativo, então foco, Esc e a camada do topo vêm do navegador, e a janela só fecha depois que a forma volta para casa.",
      task: "Use MorphDialog nas janelas do meu produto que abrem a partir de um cartão ou botão, passando esse elemento em from.",
    },
  },
  {
    slug: "morph-button",
    name: "Morph Button",
    category: "Metamorph",
    size: "s",
    usage: `<MorphButton state={state} onClick={send} labels={{ idle: "Send", done: "Sent" }} />`,
    description: "A button that shrinks into a ball while it sends and opens again with a check.",
    how: "The button's width is a spring that goes from the size of the text down to 48 px and back. Inside, the icon is a contour of the engine: an arrow, shapes while sending, and a check at the end. The state text goes to screen readers.",
    task: "Use MorphButton on the form submissions in my project.",
    pt: {
      description: "Botão que encolhe numa bolinha enquanto envia e abre de novo com o sinal de pronto.",
      how: "A largura do botão é uma mola que vai do tamanho do texto até 48 px e volta. Dentro, o ícone é um contorno do motor: seta, formas enquanto envia e o sinal de pronto no fim. O texto do estado vai para o leitor de tela.",
      task: "Use MorphButton nos envios de formulário do meu projeto.",
    },
  },
  {
    slug: "copy-morph",
    name: "Copy Morph",
    category: "Metamorph",
    size: "s",
    usage: `<CopyMorph text="npm i @usefluid/motion" />`,
    description: "A copy button where the two sheets flow into a check.",
    how: "The icon is a contour of the engine: the two sheets become a check, one of them shrinking away. The pill's width follows the new word on a spring. The word is announced to screen readers, and after a moment everything goes back.",
    task: "Use CopyMorph wherever people copy codes, links or keys in my product.",
    pt: {
      description: "Botão de copiar em que as duas folhas fluem até o sinal de pronto.",
      how: "O ícone é um contorno do motor: as duas folhas viram um sinal de pronto, uma delas encolhendo até sumir. A largura da pílula segue a palavra nova numa mola. A palavra é anunciada ao leitor de tela, e depois de um instante tudo volta.",
      task: "Use CopyMorph nos lugares em que a pessoa copia códigos, links ou chaves no meu produto.",
    },
  },
  {
    slug: "morph-loader",
    name: "Morph Loader",
    category: "Metamorph",
    size: "s",
    usage: `<MorphLoader done={!loading} />`,
    description: "A loader that keeps changing shape and ends on a check.",
    how: "While loading, the same contour goes through several shapes with the morph engine. When it is done, it flows into a check. The change is announced through a status region, without depending on the animation.",
    task: "Use MorphLoader on loads that take longer than a second.",
    pt: {
      description: "Carregando que troca de forma e termina num sinal de pronto.",
      how: "Enquanto carrega, o mesmo contorno passa por várias formas com o motor de morph. Quando termina, ele flui até um sinal de pronto. A mudança é anunciada por uma região de status, sem depender da animação.",
      task: "Use MorphLoader nos carregamentos que levam mais de um segundo.",
    },
  },
  {
    slug: "pet",
    name: "Pet",
    category: "Characters",
    size: "m",
    usage: `<Pet mood="happy" follow label="Store mascot" />

<Pet color="#ff5a1f" />
<Pet color="var(--brand-500)" />`,
    description: "A soft little square that shows its mood with its eyes alone, and the eyes follow the pointer.",
    how: "The body is a square with soft corners, a single contour, and the morph engine takes one mood's silhouette to the next. The eyes are cut-outs in a mask, each one an oval and a stroke on springs: as one shrinks the other grows, so an open eye turns into a smile or a sleepy line without a cut. That is why the face never tears. The drop above the head floats like a splash, it blinks by itself, and everything stops with reduced motion.",
    task: "Create my product's mascot with Pet, in my brand colour, and use the moods to react to what people do.",
    pt: {
      description: "Um quadradinho macio que mostra o humor só com os olhos, e os olhos seguem o ponteiro.",
      how: "O corpo é um quadrado de cantos macios, um contorno só, e o motor de morph leva a silhueta de um humor à outra. Os olhos são recortes numa máscara, cada um com um oval e um traço em molas: quando um encolhe o outro cresce, e o olho aberto vira sorriso ou sono sem corte. Por isso o rosto nunca rasga. A gota sobre a cabeça flutua como num respingo, ele pisca sozinho e para tudo com movimento reduzido.",
      task: "Crie o mascote do meu produto com Pet, na cor da minha marca, e use os humores para reagir às ações da pessoa.",
    },
  },
  {
    slug: "bot",
    name: "Bot",
    category: "Characters",
    size: "m",
    usage: `<Bot state={state} messages={messages} name="Help" />

<Bot color="#0ea5e9" state={state} messages={messages} />`,
    description: "A chat assistant with a face: it listens, thinks and answers by changing shape.",
    how: "The bot's face is the Pet. Each state of the conversation becomes a mood and a direction for the eyes: listening, it looks at your message; thinking, it looks up; answering, it looks at the reply. Messages arrive out of a blur, and the state goes to screen readers.",
    task: "Use Bot in my product's support chat, wired to the real messages.",
    pt: {
      description: "Assistente de conversa com rosto: ouve, pensa e responde mudando de forma.",
      how: "O rosto do bot é o Pet. Cada estado da conversa vira um humor e uma direção do olhar: ouvindo, ele olha para a sua mensagem; pensando, olha para cima; respondendo, olha para a resposta. As mensagens chegam saindo do desfoque, e o estado vai para o leitor de tela.",
      task: "Use Bot no chat de atendimento do meu produto, ligado às mensagens reais.",
    },
  },
  {
    slug: "mascot",
    name: "Mascot",
    category: "Characters",
    size: "m",
    usage: `<Mascot object="mug" mood={saved ? "happy" : "idle"} follow />

const coffee = pickObject("we run a small coffee shop");

<Mascot object={coffee} color="var(--fluid-accent)" />
<Mascot object="pizza" color="#ff5a1f" />`,
    description: "Over thirty object mascots, from a coffee mug to a dumbbell, that blink, follow the pointer and flow into each other.",
    how: "Each object is one silhouette in a 120 box with its own eye spot. Changing the object is Metamorph: the outline flows from a mug into a dumbbell. The eyes are cut out of the body by a mask and move on springs, and each mood changes the pose: it stretches when surprised, sinks when sleepy, tilts when curious and hops when happy.",
    task: "Give my product a mascot with Mascot. Pick the object that matches what we do with pickObject, wear our accent colour and tie its moods to real events.",
    pt: {
      description: "Mais de trinta mascotes de objetos, de uma caneca a um haltere, que piscam, seguem o ponteiro e fluem de um para o outro.",
      how: "Cada objeto é uma silhueta numa caixa de 120 com o lugar dos olhos. Trocar de objeto é Metamorfo: o contorno flui da caneca até o haltere. Os olhos são recortados do corpo por uma máscara e se movem em molas, e cada humor muda a pose: estica quando surpreso, afunda com sono, inclina curioso e pula feliz.",
      task: "Dê um mascote ao meu produto com Mascot. Escolha o objeto que combina com o que fazemos com pickObject, use a nossa cor de destaque e ligue os humores a eventos reais.",
    },
  },
  {
    slug: "segmented-picker",
    name: "Segmented Picker",
    category: "Controls",
    size: "m",
    usage: `<SegmentedPicker
  label="Period"
  value={period}
  onChange={setPeriod}
  options={[
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
  ]}
/>`,
    description: "A picker where the pill flows: one edge leaves before the other.",
    how: "Each edge of the pill has its own spring. The leading edge is fast and the trailing one is slow, so the pill stretches on the way and shrinks when it arrives, like a drop. The arrow keys change the option.",
    task: "Use SegmentedPicker for filters and tabs with up to five short options.",
    pt: {
      description: "Seletor em que a pílula escorre: uma borda sai antes da outra.",
      how: "Cada borda da pílula tem a sua mola. A borda que vai na frente é rápida e a de trás é lenta, então a pílula estica no caminho e encolhe ao chegar, como uma gota. As setas do teclado trocam a opção.",
      task: "Use SegmentedPicker nos filtros e abas com até cinco opções curtas.",
    },
  },
  {
    slug: "pill-tabs",
    name: "Pill Tabs",
    category: "Controls",
    size: "m",
    usage: `<PillTabs
  label="Orders"
  value={tab}
  onChange={setTab}
  tabs={[{ value: "all", label: "All", count: 24 }]}
/>`,
    description: "Tabs in a dark pill, with the light pill flowing between them and a count beside each.",
    how: "The same flow as the site's navbar: each edge of the light pill has its own spring, and the front one leaves before the back one. The arrow keys move between tabs, and each tab can carry a count.",
    task: "Use PillTabs on the filtered lists of my product, with the real counts.",
    pt: {
      description: "Abas numa pílula escura, com a pílula clara escorrendo entre elas e um contador ao lado.",
      how: "É o mesmo escorrer da navbar do site: cada borda da pílula clara tem a sua mola, e a da frente sai antes da de trás. As setas do teclado trocam de aba, e cada aba pode levar um contador.",
      task: "Use PillTabs nas listas com filtros do meu produto, com as contagens reais.",
    },
  },
  {
    slug: "spring-switch",
    name: "Spring Switch",
    category: "Controls",
    size: "s",
    usage: `<SpringSwitch checked={sound} onChange={setSound} label="Sound" />`,
    description: "A switch whose knob stretches on the way and lands on the spring.",
    how: "The knob's position is a spring. The faster it moves, the more it stretches sideways and thins vertically, and when it stops it is a circle again. It is a button with the switch role, so screen readers announce on and off.",
    task: "Use SpringSwitch for preferences that apply right away.",
    pt: {
      description: "Chave cujo botão estica no caminho e pousa com a mola.",
      how: "A posição do botão é uma mola. Quanto mais rápido ele anda, mais ele estica na horizontal e afina na vertical, e ao parar volta a ser um círculo. É um botão com role switch, então leitores de tela anunciam ligado e desligado.",
      task: "Use SpringSwitch nas preferências que valem na hora.",
    },
  },
  {
    slug: "spring-button",
    name: "Spring Button",
    category: "Controls",
    size: "s",
    usage: `<SpringButton onClick={save}>Save</SpringButton>
<SpringButton variant="quiet">Cancel</SpringButton>`,
    description: "A button that sinks when touched and comes back with weight, squashing with its speed.",
    how: "A spring takes the scale from 1 to 0.93 on press and back on release. The speed of that spring squashes the button along the movement, which is why it feels like it has mass. It works with touch, mouse and keyboard.",
    task: "Replace the main buttons with SpringButton, keeping the actions they already have.",
    pt: {
      description: "Botão que afunda ao toque e volta com peso, esticando conforme a velocidade.",
      how: "Uma mola leva a escala de 1 para 0,93 ao apertar e de volta ao soltar. A velocidade dessa mola achata o botão na direção do movimento, e por isso ele parece ter massa. Funciona com toque, mouse e teclado.",
      task: "Troque os botões principais por SpringButton, mantendo as ações que eles já têm.",
    },
  },
  {
    slug: "morph-island",
    name: "Morph Island",
    category: "Controls",
    size: "m",
    usage: `<MorphIsland label="New order" width={300} height={170}>
  <p>Panel content</p>
</MorphIsland>`,
    description: "A pill that grows into a panel, in the same body.",
    how: "Width and height are two springs with the same damping, so the pill grows as one body. The content comes in after 120 ms, once there is room for it. Focus moves into the panel on open and back to the pill on close, and Esc closes it.",
    task: "Use MorphIsland for the main quick action, with the content that makes sense in my product.",
    pt: {
      description: "Uma pílula que cresce e vira um painel, no mesmo corpo.",
      how: "Largura e altura são duas molas com o mesmo amortecimento, então a pílula cresce como um corpo só. O conteúdo entra depois de 120 ms, quando já existe espaço para ele. O foco vai para o painel ao abrir e volta para a pílula ao fechar, e Esc fecha.",
      task: "Use MorphIsland para a ação rápida principal, com o conteúdo que faz sentido no meu produto.",
    },
  },
  {
    slug: "word-cycle",
    name: "Word Cycle",
    category: "Text",
    size: "m",
    usage: `Made for <WordCycle words={["shops", "clinics", "schools"]} />`,
    description: "The word changes out of a blur, and the sentence never jumps in width.",
    how: "Every word sits stacked in the same grid cell, invisible, so the sentence keeps the width of the longest one. The new word comes in from a blur and the old one leaves upwards. Screen readers hear a single word.",
    task: "Use WordCycle in the main headline, with words that describe my audience.",
    pt: {
      description: "A palavra troca saindo do desfoque, e a frase não pula de largura.",
      how: "Todas as palavras ficam empilhadas na mesma célula de uma grade, invisíveis, para a frase reservar a largura da maior. A palavra nova entra com desfoque e a velha sai para cima. O leitor de tela ouve uma palavra só.",
      task: "Use WordCycle no título principal, com palavras que descrevam meu público.",
    },
  },
  {
    slug: "text-reveal",
    name: "Text Reveal",
    category: "Text",
    size: "m",
    loop: 3.6,
    usage: `<TextReveal text="Your sentence here" />`,
    description: "The headline comes in letter by letter, and screen readers get the whole sentence.",
    how: "The spring is turned into a CSS linear() curve, so each letter animates with CSS alone, no JavaScript per frame. Each letter waits a little longer than the one before. Words never break in the middle.",
    task: "Use TextReveal on a section headline, once per page.",
    pt: {
      description: "O título entra letra por letra, e o leitor de tela recebe a frase inteira.",
      how: "A mola é convertida em uma curva CSS linear(), então cada letra anima só com CSS, sem JavaScript por quadro. Cada letra espera um pouco mais que a anterior. Palavras não quebram no meio.",
      task: "Use TextReveal no título de uma seção, uma vez por página.",
    },
  },
  {
    slug: "logo-wipe",
    name: "Logo Wipe",
    category: "Transitions",
    size: "m",
    usage: `<LogoWipe logo={logo} view={tab}>
  <Screen tab={tab} />
</LogoWipe>`,
    description: "A screen change where your logo covers, holds and leaves upwards.",
    how: "When the screen changes, a curtain in the brand colour grows in a circle from the centre, with the logo popping in the middle. The content swaps under the curtain, which then rises. With reduced motion the swap is direct.",
    task: "Use LogoWipe on the important screen changes, with my logo.",
    pt: {
      description: "Troca de tela em que a sua logo cobre, segura e sai para cima.",
      how: "Quando a tela muda, uma cortina na cor da marca cresce em círculo a partir do centro, com a logo pulando no meio. A troca do conteúdo acontece por baixo da cortina, que depois sobe. Com movimento reduzido a troca é direta.",
      task: "Use LogoWipe nas trocas de tela importantes, com a minha logo.",
    },
  },
  {
    slug: "island-toast",
    name: "Island Toast",
    category: "Transitions",
    size: "m",
    usage: `<IslandToast message={notice} />`,
    description: "A notice that drops from the top as a pill, grows with the message and goes back up.",
    how: "The drop, the width and the height are three springs, so the pill arrives, stretches to fit the sentence and leaves as one body. The width comes from the real size of the text. The sentence comes in once there is room for it, and goes to screen readers through a status region.",
    task: "Use IslandToast for the result notices of my product's actions.",
    pt: {
      description: "Um aviso que desce do topo como uma pílula, cresce com a mensagem e volta para cima.",
      how: "A descida, a largura e a altura são três molas, então a pílula chega, se estica até caber a frase e volta como um corpo só. A largura vem da medida real do texto. A frase entra depois que existe espaço para ela, e vai para o leitor de tela por uma região de status.",
      task: "Use IslandToast nos avisos de resultado das ações do meu produto.",
    },
  },
  {
    slug: "splash-choice",
    name: "Splash Choice",
    category: "Splash",
    size: "l",
    loop: 9,
    usage: `<SplashChoice
  logo={logo}
  title="Made for"
  word="you."
  options={[
    { value: "shops", label: "Shops", word: "shops.", shape: shapes.square },
    { value: "apps", label: "Apps", word: "apps.", shape: shapes.capsule },
  ]}
/>`,
    description: "Shapes become the logo, it rises, and each option you pick changes the shape and the sentence.",
    how: "The full opening. A timeline takes the contour through the shapes to the logo, and it rises to its place. Then each option in the picker sends the same contour to another shape and swaps the headline's word out of a blur. One body from start to end.",
    task: "Build my product's opening with SplashChoice, my logo and the areas of my business as options.",
    pt: {
      description: "Formas viram a logo, ela sobe, e cada opção escolhida muda a forma e a frase.",
      how: "É a abertura completa. Uma linha do tempo leva o contorno pelas formas até a logo, e ela sobe para o lugar dela. Depois, cada opção do seletor manda o mesmo contorno para outra forma e troca a palavra do título saindo do desfoque. É um corpo só do começo ao fim.",
      task: "Crie a abertura do meu produto com SplashChoice, a minha logo e as frentes do meu negócio como opções.",
    },
  },
  {
    slug: "splash-shapes",
    name: "Splash Shapes",
    category: "Splash",
    size: "l",
    loop: 7.5,
    usage: `<SplashShapes
  logo={logo}
  title="From idea,"
  words={["to site.", "to product."]}
  action="Get started"
/>`,
    description: "Shapes become the logo, it rises, and the sentence and the button appear.",
    how: "A timeline marks each shape, the logo's arrival and the rise. The logo starts at the centre of the screen and rises to its place on a spring transition. The sentence and the button come out of a blur, and the button can only be clicked once it shows.",
    task: "Build my product's opening with SplashShapes, my logo and a sentence about what I do.",
    pt: {
      description: "Formas viram a logo, ela sobe, e a frase e o botão aparecem.",
      how: "Uma linha do tempo marca cada forma, a chegada da logo e a subida. A logo começa no centro da tela e sobe até o lugar dela numa transição de mola. A frase e o botão saem do desfoque, e o botão só pode ser clicado quando aparece.",
      task: "Crie a abertura do meu produto com SplashShapes, a minha logo e uma frase sobre o que eu faço.",
    },
  },
  {
    slug: "splash-dots",
    name: "Splash Dots",
    category: "Splash",
    size: "m",
    loop: 5.2,
    usage: `<SplashDots logo={logo} name="Your brand" />`,
    description: "Scattered dots fly to the logo's outline and it fills in.",
    how: "These are the same points the engine uses for the morph, now visible. Each one starts at a place picked with a fixed seed, so the scene is always the same, and flies to the outline on a spring curve with a small delay. Then the logo fills and the name comes in.",
    task: "Build my product's opening with SplashDots, my logo and the brand name.",
    pt: {
      description: "Pontos espalhados voam até o contorno da logo e ela se preenche.",
      how: "São os mesmos pontos que o motor usa para o morph, agora visíveis. Cada um começa num lugar sorteado com semente fixa, então a cena é sempre igual, e voa até o contorno com uma curva de mola e um pequeno atraso. Depois a logo se preenche e o nome entra.",
      task: "Crie a abertura do meu produto com SplashDots, a minha logo e o nome da marca.",
    },
  },
  {
    slug: "stat-counter",
    name: "Stat Counter",
    category: "Data",
    size: "m",
    usage: `<StatCounter label="Revenue today" value={16902} previous={13380} format={{ style: "currency", currency: "USD" }} />`,
    description: "A dashboard number that rolls to its new value, with a change badge whose arrow flows up or down.",
    how: "One spring carries the number, critically damped, so the digits roll and settle without overshooting the real value. The arrow in the badge is a shape of the engine: up and down are two drawings, and it flows between them. Screen readers get the label, the final value and the change, never the rolling digits.",
    task: "Use StatCounter for the key numbers of my dashboard, with the real values and the previous period to compare.",
    pt: {
      description: "Um número de dashboard que gira até o novo valor, com um selo de variação cuja seta flui para cima ou para baixo.",
      how: "Uma mola leva o número, com amortecimento crítico, para os dígitos girarem e assentarem sem passar do valor real. A seta do selo é uma forma do motor: para cima e para baixo são dois desenhos, e ela flui entre eles. Leitores de tela recebem o rótulo, o valor final e a variação, nunca os dígitos girando.",
      task: "Use StatCounter nos números principais do meu dashboard, com os valores reais e o período anterior para comparar.",
    },
  },
  {
    slug: "spring-bars",
    name: "Spring Bars",
    category: "Data",
    size: "m",
    usage: `<SpringBars label="Orders this week" max={100} data={[{ label: "Mon", value: 32 }, { label: "Tue", value: 48 }]} />`,
    description: "A bar chart whose bars rise like liquid, with a value bubble that flows to the bar you point at.",
    how: "Each bar has a spring of its own, a little slower from left to right, so a change ripples across the chart instead of jumping. The bubble is on two springs, sideways and up, and follows the pointer or the arrow keys. Every bar is a button read with its label and value.",
    task: "Replace the bar charts of my dashboard with SpringBars, with a fixed max so bars compare across changes.",
    pt: {
      description: "Um gráfico de barras em que as barras sobem como líquido, com uma bolha de valor que flui até a barra apontada.",
      how: "Cada barra tem a própria mola, um pouco mais lenta da esquerda para a direita, então uma mudança atravessa o gráfico como uma onda em vez de pular. A bolha anda em duas molas, para o lado e para cima, e segue o ponteiro ou as setas do teclado. Cada barra é um botão lido com o rótulo e o valor.",
      task: "Troque os gráficos de barras do meu dashboard por SpringBars, com um max fixo para as barras se compararem entre mudanças.",
    },
  },
  {
    slug: "area-morph",
    name: "Area Morph",
    category: "Data",
    size: "m",
    usage: `<AreaMorph label="Visitors" values={[20, 34, 28, 52, 46, 70]} max={100} />`,
    description: "An area chart that flows from one set of numbers to the next like a liquid, on the engine that morphs logos.",
    how: "The values become a smooth closed shape in the 120 box, and the morph engine flows it to the next shape: every point of the outline has its own spring, so the area moves like water settling. At rest the exact drawing of the data comes back. The chart is an image read with its label and values.",
    task: "Use AreaMorph for the trend charts of my dashboard, switching ranges such as week, month and year.",
    pt: {
      description: "Um gráfico de área que flui de um conjunto de números para o próximo como líquido, no motor que transforma logos.",
      how: "Os valores viram uma forma fechada e suave na caixa de 120, e o motor de morph flui até a próxima forma: cada ponto do contorno tem a própria mola, então a área se move como água assentando. Ao parar, volta o desenho exato dos dados. O gráfico é uma imagem lida com o rótulo e os valores.",
      task: "Use AreaMorph nos gráficos de tendência do meu dashboard, trocando períodos como semana, mês e ano.",
    },
  },
  {
    slug: "spring-calendar",
    name: "Spring Calendar",
    category: "Data",
    size: "m",
    usage: `<SpringCalendar value={date} onChange={setDate} />`,
    description: "A month calendar where the selection flows from day to day and the month slides in from the side it came from.",
    how: "The selection is one pill on two springs, across and down the grid, so it travels between days instead of blinking. Changing month moves the days a short way on a spring from the side you came from. It is a date grid: arrows move by day and week, Page Up and Page Down by month, and each day is read as a full date.",
    task: "Use SpringCalendar for the date fields of my product, in my language and with my first day of the week.",
    pt: {
      description: "Um calendário do mês em que a seleção flui de dia em dia e o mês entra deslizando do lado de onde veio.",
      how: "A seleção é uma pílula em duas molas, na horizontal e na vertical da grade, então viaja entre os dias em vez de piscar. Trocar de mês move os dias um pouco, numa mola, a partir do lado de onde você veio. É uma grade de datas: as setas andam por dia e semana, Page Up e Page Down por mês, e cada dia é lido como data completa.",
      task: "Use SpringCalendar nos campos de data do meu produto, no meu idioma e com o meu primeiro dia da semana.",
    },
  },
  {
    slug: "progress-ring",
    name: "Progress Ring",
    category: "Data",
    size: "m",
    usage: `<ProgressRing label="Monthly goal" value={73} />`,
    description: "A ring that fills on a spring toward a goal, with the percent rolling in the middle.",
    how: "One spring drives both the arc and the number, with a little overshoot, so the ring passes its mark and settles back like something with weight. At the goal the stroke swells once. It is a progress bar for screen readers, with its label and values.",
    task: "Use ProgressRing for the goals and quotas of my dashboard, with the real targets.",
    pt: {
      description: "Um anel que enche numa mola até a meta, com a porcentagem girando no meio.",
      how: "Uma mola move o arco e o número juntos, com um pouco de passagem do ponto, então o anel passa da marca e volta como algo com peso. Ao chegar na meta o traço incha uma vez. Para leitores de tela é uma barra de progresso, com o rótulo e os valores.",
      task: "Use ProgressRing nas metas e cotas do meu dashboard, com os alvos reais.",
    },
  },
  {
    slug: "rank-list",
    name: "Rank List",
    category: "Data",
    size: "m",
    usage: `<RankList label="Sales this month" items={[{ id: "ana", label: "Ana", value: 610 }]} />`,
    description: "A ranking whose rows travel to their new place on springs when the numbers change.",
    how: "Each row has a spring for its place, so when the order changes the rows slide past each other instead of jumping, and a row that climbs passes over the rest. The values roll on springs of their own. The list is in ranked order in the page, so screen readers read the places right, and ties keep their order.",
    task: "Use RankList for the leaderboards and top lists of my dashboard, with stable ids for each row.",
    pt: {
      description: "Um ranking em que as linhas viajam até o novo lugar em molas quando os números mudam.",
      how: "Cada linha tem uma mola para a sua posição, então quando a ordem muda as linhas deslizam umas pelas outras em vez de pular, e a que sobe passa por cima das outras. Os valores giram nas próprias molas. A lista fica na ordem do ranking na página, então leitores de tela leem as posições certas, e empates mantêm a ordem.",
      task: "Use RankList nos rankings e listas de destaque do meu dashboard, com ids estáveis em cada linha.",
    },
  },
];

export const textsFor = (entry: Entry, lang: Lang): Texts => (lang === "pt" ? entry.pt : entry);

export const COMMON_RULES: Record<Lang, string> = {
  en: "Read my project first. Use my logo, my colours and my font through the --fluid-* variables. Keep 44px touch targets, visible focus and reduced motion. If I have no SVG logo, ask before making one up.",
  pt: "Leia meu projeto primeiro. Use a minha logo, as minhas cores e a minha fonte pelas variáveis --fluid-*. Mantenha alvos de toque de 44px, foco visível e movimento reduzido. Se eu não tiver logo em SVG, pergunte antes de inventar uma.",
};

export const promptFor = (entry: Entry, lang: Lang = "en") =>
  lang === "pt"
    ? `Adicione ${entry.name} ao meu projeto com a biblioteca Fluid. ${entry.pt.task} ${COMMON_RULES.pt}`
    : `Add ${entry.name} to my project with the Fluid library. ${entry.task} ${COMMON_RULES.en}`;
