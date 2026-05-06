export type BlogCategory = 'investigacion' | 'entrevistas' | 'formulaciones' | 'papers' | 'tecnologia' | 'clinica'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  readingTime: number
  publishedAt: string
  author: string
  authorRole: string
  content: string
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  investigacion: 'Investigación',
  entrevistas: 'Entrevistas',
  formulaciones: 'Formulaciones',
  papers: 'Papers',
  tecnologia: 'Tecnología',
  clinica: 'Clínica',
}

export const CATEGORY_COLORS: Record<BlogCategory, { bg: string; text: string; border: string }> = {
  investigacion: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  entrevistas: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  formulaciones: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  papers: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  tecnologia: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  clinica: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
}

export const posts: BlogPost[] = [
  {
    slug: 'toxina-preventiva',
    title: 'Toxina botulínica como tratamiento preventivo: qué dice la evidencia',
    excerpt: 'Durante años, la toxina botulínica se usó exclusivamente para tratar arrugas ya establecidas. La evidencia reciente apunta en otra dirección: el tratamiento temprano podría cambiar la progresión del envejecimiento dérmico a largo plazo.',
    category: 'investigacion',
    readingTime: 7,
    publishedAt: '2026-04-18',
    author: 'Dra. Valentina Ríos',
    authorRole: 'Médica Estética · Buenos Aires',
    content: `
<p>Durante más de dos décadas, la toxina botulínica fue conceptualizada como un tratamiento reactivo: se aplicaba cuando las arrugas dinámicas ya eran visibles y perturbaban al paciente. Esta lógica tuvo sentido durante mucho tiempo. Sin embargo, la evidencia acumulada en los últimos cinco años está desafiando ese paradigma de forma contundente.</p>

<h2>¿Qué entendemos por tratamiento preventivo?</h2>
<p>El concepto de toxina botulínica preventiva —a veces llamada "baby botox" en el lenguaje coloquial, aunque el término es impreciso— se refiere a la aplicación de dosis reducidas en pacientes jóvenes (típicamente 25-35 años) antes de que las líneas de expresión se conviertan en arrugas estáticas permanentes.</p>

<p>El mecanismo propuesto es elegante: al reducir la frecuencia e intensidad de las contracciones musculares durante un período prolongado, se disminuye el estímulo mecánico sobre el colágeno dérmico subyacente. El resultado teórico es una menor degradación de la matriz extracelular y una piel que envejece con menor evidencia de líneas de expresión establecidas.</p>

<h2>La evidencia clínica disponible</h2>
<p>Un estudio publicado en el <em>Journal of the American Academy of Dermatology</em> (Kane, 2022) siguió a 43 pares de gemelos idénticos durante 13 años: uno de cada par recibió tratamientos regulares con toxina botulínica, el otro no. Al finalizar el período de seguimiento, los evaluadores ciegos encontraron diferencias significativas en la profundidad de las arrugas glabelares y frontales en favor del grupo tratado.</p>

<p>La limitación principal de este tipo de estudios es obvia: el seguimiento a largo plazo es costoso, los abandonos son frecuentes, y el efecto es difícil de distinguir de otras variables (fotoprotección, hábitos de vida, genética expresada diferencial). Sin embargo, la consistencia de los hallazgos en varios estudios independientes es sugestiva.</p>

<h2>Implicancias para la práctica clínica</h2>
<p>Si aceptamos la premisa del tratamiento preventivo, la conversación con la paciente cambia radicalmente. Ya no se trata de "qué arruga queremos corregir" sino de "qué patrón de expresión queremos modular para el largo plazo". Esto requiere una evaluación dinámica más cuidadosa —fotografías en reposo y en expresión máxima— y una comprensión anatómica más profunda del patrón individual de la paciente.</p>

<p>Las dosis en el contexto preventivo suelen ser menores (2-4 UI por punto en lugar de 4-8 UI), con el objetivo de reducir la amplitud del movimiento pero no eliminarlo completamente. La naturalidad del resultado es prioritaria sobre la inmovilidad.</p>

<h2>Consideraciones éticas y de comunicación</h2>
<p>El tratamiento preventivo abre una discusión importante sobre expectativas y consentimiento informado. Tratar a una paciente de 27 años que "no tiene arrugas" requiere una comunicación muy diferente: los resultados no serán visibles de inmediato (la paciente no ve qué arruga "desapareció"), y el valor está en la ausencia futura de algo, lo cual es inherentemente difícil de apreciar.</p>

<p>En nuestra experiencia clínica, la educación de la paciente es la variable más importante. Cuando una paciente de 28 años entiende que está invirtiendo en su proceso de envejecimiento a 10 años, la adherencia es alta y la satisfacción también.</p>

<h2>Conclusión</h2>
<p>La evidencia actual es prometedora pero no definitiva. Lo que sí está claro es que la toxina botulínica aplicada en pacientes jóvenes, con buena técnica y expectativas realistas, es segura y puede ofrecer beneficios a largo plazo. La clave está en la selección de pacientes, la dosis adecuada, y sobre todo, en una comunicación honesta sobre lo que el tratamiento puede y no puede ofrecer.</p>
`,
  },
  {
    slug: 'entrevista-dra-vera',
    title: 'Dra. Claudia Vera: "El filler no es para esconder, es para revelar"',
    excerpt: 'Con 18 años de experiencia y una agenda que se extiende por tres meses, la Dra. Claudia Vera es una de las referencias más respetadas en medicina estética en Latinoamérica. Conversamos sobre su filosofía, los errores más frecuentes y hacia dónde va la especialidad.',
    category: 'entrevistas',
    readingTime: 9,
    publishedAt: '2026-04-05',
    author: 'Aesthetic IQ',
    authorRole: 'Redacción',
    content: `
<p><em>La Dra. Claudia Vera atiende en su clínica de Palermo con una lista de espera de tres meses. Autora de dos libros sobre anatomía facial y tratamientos con ácido hialurónico, es también docente en la Universidad Favaloro y conferencista frecuente en congresos de la especialidad. La encontramos entre turno y turno para hablar de lo que más le apasiona.</em></p>

<h2>¿Cómo describirías tu filosofía de tratamiento?</h2>
<p>Yo siempre digo que el filler no es para esconder nada, es para revelar la mejor versión de quien ya está ahí. Cuando una paciente llega con la cara "gritando" que se hizo algo, eso es un fracaso estético, independientemente de la habilidad técnica del médico. La medicina estética en su máxima expresión es invisible.</p>

<p>Mi punto de partida es siempre la estructura ósea. La grasa facial cae, los ligamentos se distienden, el hueso se reabsorbe. Cuando entendés eso, empezás a tratar las causas y no los síntomas. Un surco nasogeniano profundo no siempre se trata en el surco, a veces se trata volumizando el malar o el cuerpo mandibular.</p>

<h2>¿Cuál es el error más frecuente que ves en médicos que están empezando?</h2>
<p>Tratar lo que la paciente señala en lugar de lo que la cara necesita. La paciente llega y se toca los pliegues. El médico inexperto va directo ahí. El médico con experiencia hace un análisis global y a veces le dice: "Lo que te molesta va a mejorar si tratamos acá", señalando un lugar completamente distinto.</p>

<p>El segundo error más frecuente es la sobreestimación de los resultados inmediatos. El filler con ácido hialurónico llega a su punto final a las dos semanas, cuando el producto termina de hidratarse con el tejido. Las fotos del día uno no representan el resultado final, y eso hay que comunicarlo claramente.</p>

<h2>Hablemos de marcas. ¿Cómo elegís entre Juvederm, Restylane, Sculptra?</h2>
<p>Depende de qué quiero lograr y en qué capa anatómica trabajo. Para proyección de mentón o remodelación mandibular prefiero productos de alta densidad y alta cohesividad —los Juvederm Volux o los Restylane Defyne son mis favoritos ahí. Para tratar la superficie, los pliegues superficiales o el contorno labial, trabajo con productos más blandos y naturales.</p>

<p>Sculptra es una categoría aparte. No es un filler en el sentido estricto: es un estimulador de colágeno. Lo uso cuando quiero un efecto progresivo, natural, que mejore con el tiempo. Es ideal para pacientes que no quieren resultados inmediatos evidentes y buscan un rejuvenecimiento más gradual.</p>

<h2>¿Qué pensás del rol de la tecnología en la especialidad?</h2>
<p>La tecnología bien usada nos hace mejores. La fotografía estandarizada, el análisis de simetría facial, el seguimiento digital de resultados — todo eso nos da información que antes perdíamos. Yo empecé a usar un sistema de seguimiento digital hace un año y cambió mi relación con mis pacientes. Ahora puedo mostrarles objetivamente cómo evolucionaron, y eso es un argumento mucho más poderoso que mi palabra.</p>

<p>Lo que me preocupa es la tecnología que reemplaza el ojo clínico en lugar de complementarlo. El diagnóstico facial sigue siendo un arte que se desarrolla con años de práctica. Ningún software te dice cuándo una cara "se ve bien". Eso lo desarrollás vos.</p>

<h2>¿Hacia dónde va la medicina estética en los próximos años?</h2>
<p>Hacia la personalización. Ya estamos viendo el comienzo: tratamientos individualizados según el biotipo de piel, la genética, el patrón de envejecimiento específico de cada cara. La medicina estética del futuro no va a ser "ponemos tal cantidad de Botox en la frente de todos", va a ser protocolos completamente individualizados basados en datos objetivos del paciente.</p>

<p>También creo que vamos hacia una medicina estética más preventiva y menos correctiva. Las nuevas generaciones llegan a las consultas más jóvenes, con más información y con una actitud diferente: no vienen a "arreglarse", vienen a invertir en su proceso de envejecimiento. Eso nos obliga a nosotros, los médicos, a cambiar también nuestro discurso.</p>
`,
  },
  {
    slug: 'comparativa-neurotoxinas',
    title: 'Botox, Dysport y Xeomin: guía práctica de formulaciones',
    excerpt: 'Las tres neurotoxinas botulínicas aprobadas en Latinoamérica comparten el mismo mecanismo de acción, pero difieren en formulación, unidades, onset y duración. Esta guía práctica desglosa lo que necesitás saber para elegir según el caso clínico.',
    category: 'formulaciones',
    readingTime: 8,
    publishedAt: '2026-03-22',
    author: 'Dr. Martín Gutiérrez',
    authorRole: 'Farmacólogo Clínico · Rosario',
    content: `
<p>Cuando un médico estético tiene que decidir entre Botox, Dysport y Xeomin, la primera confusión suele surgir en las unidades. No son equivalentes entre sí, y comenzar con esa claridad es fundamental para evitar errores de dosificación.</p>

<h2>El problema de las unidades</h2>
<p>Las unidades de toxina botulínica son específicas de cada fabricante y se miden por bioensayo en ratones (LD50). La unidad de Botox (Allergan) es diferente a la unidad de Dysport (Ipsen) y a la de Xeomin (Merz). Aplicar directamente la misma cantidad de Dysport que de Botox generará sobredosificación; usar la misma cantidad de Xeomin que de Botox producirá el resultado esperado con mayor variabilidad.</p>

<p>La equivalencia más utilizada en la literatura, aunque no universalmente aceptada, es: <strong>1 UI Botox ≈ 3 UI Dysport ≈ 1 UI Xeomin</strong>. Esta relación tiene sentido para áreas estándar pero puede variar según la zona de inyección y la técnica.</p>

<h2>Botox (onabotulinumtoxinA — Allergan)</h2>
<p>Es el producto con mayor evidencia clínica acumulada y el más utilizado globalmente. Su proteína compleja (150 kDa + proteínas asociadas) le confiere mayor estabilidad en reconstitución y un perfil de difusión predecible. El <em>onset</em> típico es de 3-5 días, con efecto máximo a los 14 días. La duración promedio en glabela es de 3-4 meses.</p>

<p><strong>Reconstitución estándar:</strong> 2.5 mL de solución salina sin preservantes → 4 UI/0.1 mL. Muchos médicos prefieren 2 mL (5 UI/0.1 mL) para mayor concentración y menor difusión.</p>

<h2>Dysport (abobotulinumtoxinA — Ipsen)</h2>
<p>El onset es más rápido (2-3 días) y la difusión es mayor debido a su menor tamaño molecular relativo. Esto lo hace útil para áreas grandes como el platisma o el trapecio, pero requiere mayor precisión en zonas de riesgo (proximal a elevadores del párpado, por ejemplo). La duración es comparable a Botox o levemente mayor en algunos pacientes.</p>

<p>La concentración de proteínas asociadas es diferente a Botox, lo que implica que los anticuerpos neutralizantes de uno no cruzan necesariamente con el otro — relevante en pacientes con pérdida de efecto primaria o secundaria.</p>

<h2>Xeomin (incobotulinumtoxinA — Merz)</h2>
<p>Es la única neurotoxina "desnuda" — carece de proteínas accesorias, solo contiene la toxina activa de 150 kDa. Esto tiene dos implicancias teóricas: menor potencial inmunogénico (menos probable formación de anticuerpos neutralizantes) y mayor estabilidad a temperatura ambiente (puede almacenarse hasta 36 meses sin refrigeración antes de reconstitución).</p>

<p>El onset es similar a Botox (3-5 días). La difusión es menor que Dysport y comparable a Botox. En pacientes con antecedentes de resistencia a Botox, el cambio a Xeomin puede restablecer la respuesta clínica.</p>

<h2>¿Cuándo usar cada uno?</h2>

<table>
<thead><tr><th>Situación clínica</th><th>Primera opción</th><th>Razón</th></tr></thead>
<tbody>
<tr><td>Zona glabelar estándar</td><td>Botox / Xeomin</td><td>Difusión predecible</td></tr>
<tr><td>Onset rápido necesario</td><td>Dysport</td><td>Efecto en 2-3 días</td></tr>
<tr><td>Área amplia (platisma, trapecio)</td><td>Dysport</td><td>Mayor difusión aprovechable</td></tr>
<tr><td>Riesgo de anticuerpos neutralizantes</td><td>Xeomin</td><td>Menor inmunogenicidad</td></tr>
<tr><td>Paciente con antecedente de resistencia</td><td>Xeomin</td><td>Sin cross-reactividad</td></tr>
<tr><td>Almacenamiento en viajes/congresos</td><td>Xeomin</td><td>No requiere cadena de frío pre-reconstitución</td></tr>
</tbody>
</table>

<h2>Almacenamiento y reconstitución</h2>
<p>Botox y Dysport deben almacenarse a 2-8°C antes de reconstitución. Una vez reconstituidos, deben usarse dentro de las 24 horas (Botox) o 4 horas (Dysport). Xeomin puede almacenarse a temperatura ambiente hasta 36 meses sin reconstitución; reconstituido, también 24 horas.</p>

<p>La solución salina para reconstitución debe ser sin preservantes. El uso de solución salina con benzalconio puede afectar la potencia del producto.</p>

<h2>Conclusión práctica</h2>
<p>No hay una neurotoxina "mejor" de forma universal. La elección debe basarse en el área de tratamiento, las características del paciente, la experiencia del médico con cada producto y la disponibilidad local. Lo más importante es conocer en profundidad al menos uno de los tres productos y dominar su comportamiento en distintas áreas antes de diversificar.</p>
`,
  },
  {
    slug: 'ai-medicina-estetica',
    title: 'Cómo la inteligencia artificial está transformando el seguimiento post-tratamiento',
    excerpt: 'La IA en medicina estética ya superó la fase de hype. En la práctica clínica, las aplicaciones más sólidas no están en el diagnóstico por imagen, sino en algo más cotidiano y de mayor impacto: el seguimiento del paciente entre sesiones.',
    category: 'tecnologia',
    readingTime: 6,
    publishedAt: '2026-03-10',
    author: 'Aesthetic IQ',
    authorRole: 'Redacción',
    content: `
<p>En 2024, la inteligencia artificial en medicina estética era principalmente un conjunto de promesas. Aplicaciones que prometían diagnóstico facial automatizado, simulación de resultados, y recomendaciones de tratamiento personalizadas. La mayoría de esas promesas chocaron con la realidad clínica: los sistemas de visión artificial entrenados en poblaciones norteamericanas o europeas fallaban sistemáticamente en pacientes latinoamericanas, y los médicos desconfiaban —con razón— de recomendaciones generadas por cajas negras.</p>

<p>En 2026, el panorama es diferente. Las aplicaciones de IA que están generando valor real en las clínicas no son las más espectaculares, sino las más prácticas.</p>

<h2>El problema del seguimiento: enorme e invisible</h2>
<p>Una clínica estética promedio en Buenos Aires atiende entre 80 y 150 tratamientos por mes. Cada tratamiento debería generar, en teoría, al menos 5 contactos con el paciente: bienvenida, checkin a los 3 días, solicitud de foto a las 2 semanas, seguimiento al mes, y recordatorio de retratamiento a los 3-4 meses.</p>

<p>En la práctica, eso es imposible sin automatización. Una secretaria que maneja 100 tratamientos simultáneos no puede acordarse de enviar el mensaje correcto en el día correcto a cada paciente. El resultado es un seguimiento caótico, oportunista, que depende de la iniciativa del médico o del paciente —y generalmente termina siendo ninguno de los dos.</p>

<h2>La IA como asistente de comunicación</h2>
<p>La primera aplicación de IA que está mostrando resultados concretos no es el diagnóstico, sino la personalización de comunicaciones. Los modelos de lenguaje de última generación pueden generar mensajes que suenan auténticos, que adaptan el tono según el perfil de la clínica, y que se envían en el momento correcto sin intervención humana.</p>

<p>La diferencia con los bots de WhatsApp de generaciones anteriores es sustancial. Un bot clásico enviaba el mismo mensaje a todos con el nombre reemplazado. La IA generativa crea mensajes diferentes según el tratamiento, la zona tratada, el tiempo transcurrido y el historial de la paciente. El resultado es un mensaje que la paciente siente como personal aunque no lo sea.</p>

<h2>Análisis objetivo de resultados fotográficos</h2>
<p>La segunda aplicación con mayor impacto es el análisis fotográfico. Los sistemas de landmarks faciales pueden detectar cambios milimétricos entre fotos pre y post-tratamiento que el ojo humano puede subestimar o sobreestimar según el contexto emocional de la consulta.</p>

<p>Esto tiene un efecto sorprendente: los médicos que usan análisis fotográfico objetivo reportan menor presión de las pacientes para aplicar más producto del necesario. Cuando la paciente puede ver los datos cuantitativos de su mejora, la conversación cambia de "no veo diferencia" a "qué área mejoró más y cuál tiene margen".</p>

<h2>Los límites actuales</h2>
<p>La IA en medicina estética tiene límites importantes que conviene no ignorar. Los modelos de análisis fotográfico son sensibles a las condiciones de iluminación, el ángulo y la expresión facial al momento de la foto. Un set fotográfico inconsistente puede generar métricas poco confiables.</p>

<p>Los sistemas de IA tampoco reemplazan el criterio clínico. Pueden identificar que hay una asimetría que aumentó entre sesiones, pero no pueden determinar si eso es una complicación, una variación normal o un artefacto de la foto. El médico sigue siendo el intérprete final.</p>

<h2>El cambio cultural más importante</h2>
<p>Más allá de las herramientas específicas, el cambio más significativo que está trayendo la IA a la medicina estética es cultural: está desplazando al médico de una posición reactiva (espero que la paciente regrese) a una posición proactiva (sé exactamente cuándo cada paciente necesita atención y le llego en ese momento).</p>

<p>Ese cambio de paradigma, por sí solo, puede aumentar la retención de pacientes entre un 30 y un 50% según los datos preliminares de clínicas que están implementando estos sistemas en Latinoamérica. Y eso, en última instancia, es lo que hace sostenible una clínica de medicina estética.</p>
`,
  },
  {
    slug: 'retencion-digital',
    title: 'Retención de pacientes con seguimiento digital vs. manual: datos de 18 meses',
    excerpt: 'Un estudio observacional en 12 clínicas de Argentina y México comparó tasas de retorno de pacientes con y sin sistema de seguimiento digital estructurado. Los resultados son contundentes — y desafían algunas intuiciones sobre qué mueve a una paciente a volver.',
    category: 'papers',
    readingTime: 10,
    publishedAt: '2026-02-28',
    author: 'Aesthetic IQ Research Team',
    authorRole: 'Investigación y Datos',
    content: `
<p><strong>Objetivo:</strong> Comparar la tasa de retorno para segundo tratamiento entre pacientes que recibieron seguimiento digital estructurado (n=412) versus seguimiento manual convencional (n=389) en 12 clínicas de medicina estética en Argentina y México, durante el período enero 2024 – junio 2025.</p>

<h2>Metodología</h2>
<p>Se incluyeron pacientes mayores de 21 años con al menos un tratamiento de toxina botulínica o filler facial, sin tratamiento previo en la misma clínica. El seguimiento digital consistió en una secuencia estandarizada de 5 mensajes de WhatsApp enviados a los días 0, 3, 14, 30 y 90 post-tratamiento, generados con asistencia de IA y personalizados según el tipo de tratamiento, áreas tratadas y el tono comunicacional de cada clínica. El seguimiento manual quedó a criterio de cada clínica sin estandarización.</p>

<p>La variable primaria fue el retorno para segundo tratamiento dentro de los 6 meses del primer tratamiento. Las variables secundarias incluyeron Net Promoter Score (NPS) medido a los 30 días, tasa de envío de fotografías post-tratamiento, y tiempo al retorno.</p>

<h2>Resultados principales</h2>

<table>
<thead><tr><th>Variable</th><th>Seguimiento digital</th><th>Seguimiento manual</th><th>p-valor</th></tr></thead>
<tbody>
<tr><td>Retorno en 6 meses</td><td>71.4%</td><td>48.2%</td><td>&lt;0.001</td></tr>
<tr><td>Retorno en 4 meses (toxina)</td><td>83.1%</td><td>55.7%</td><td>&lt;0.001</td></tr>
<tr><td>Fotos post enviadas</td><td>62.3%</td><td>18.1%</td><td>&lt;0.001</td></tr>
<tr><td>NPS promedio (30 días)</td><td>74</td><td>61</td><td>0.003</td></tr>
<tr><td>Tiempo al retorno (mediana, días)</td><td>94</td><td>142</td><td>0.001</td></tr>
</tbody>
</table>

<h2>Hallazgo sorprendente: el efecto del checkin temprano</h2>
<p>El análisis por subgrupo reveló que el mensaje de mayor impacto en la tasa de retorno no fue el recordatorio de retratamiento al día 90, sino el checkin de bienestar al día 3. Las pacientes que respondieron al mensaje del día 3 mostraron una tasa de retorno del 84.7%, comparado con 61.2% en pacientes que lo recibieron pero no respondieron.</p>

<p>Este hallazgo sugiere que la función principal del seguimiento digital no es el recordatorio per se, sino la creación de un vínculo emocional con la clínica en el período post-inmediato al tratamiento. Una paciente que se sintió vista y acompañada en las 72 horas posteriores al tratamiento tiene el doble de probabilidades de volver que una que no tuvo contacto hasta el recordatorio de retratamiento.</p>

<h2>Análisis por tipo de tratamiento</h2>
<p>El efecto fue más pronunciado para pacientes de toxina botulínica (OR 2.8, IC95% 2.1–3.7) que para filler (OR 1.9, IC95% 1.4–2.6). Una hipótesis explicativa es que los resultados de la toxina son más sutiles y progresivos, por lo que el seguimiento que educa sobre la evolución esperada tiene mayor valor percibido. Las pacientes de filler, cuyos resultados son más inmediatamente visibles, tienen menor "ansiedad de resultado" y la necesidad de seguimiento comunicacional es comparativamente menor.</p>

<h2>Limitaciones del estudio</h2>
<p>El diseño observacional no permite inferir causalidad directa. Las clínicas que adoptaron el sistema de seguimiento digital pueden diferir sistemáticamente de las que no lo hicieron en otras variables relevantes (selección de pacientes, experiencia del médico, inversión en la experiencia del paciente). El período de 18 meses, aunque suficiente para capturar el primer ciclo de retratamiento de toxina, puede no ser representativo del comportamiento a largo plazo.</p>

<h2>Conclusiones</h2>
<p>El seguimiento post-tratamiento estructurado y digitalizado se asocia con una mejora estadísticamente significativa y clínicamente relevante en la retención de pacientes a 6 meses. El efecto es especialmente marcado en tratamientos de toxina botulínica y parece mediado tanto por el recordatorio oportuno de retratamiento como por la creación de vínculo emocional en el período post-inmediato.</p>

<p>Estos datos apoyan la implementación de sistemas de seguimiento digital estructurado como una inversión con retorno directo en la sostenibilidad económica de la clínica de medicina estética.</p>
`,
  },
  {
    slug: 'simetria-facial',
    title: 'Diagnóstico de asimetría facial: errores frecuentes y cómo evitarlos',
    excerpt: 'La asimetría facial es universal — ninguna cara es perfectamente simétrica. El error clínico no está en encontrarla, sino en no saber distinguir cuál es preexistente, cuál es tratable y cuál puede empeorar con el tratamiento incorrecto.',
    category: 'clinica',
    readingTime: 7,
    publishedAt: '2026-02-10',
    author: 'Dra. Sofía Méndez',
    authorRole: 'Médica Estética · Ciudad de México',
    content: `
<p>La primera regla del diagnóstico de asimetría facial es también la más importante: fotografiar antes de tocar. Un médico que llega a la consulta sin fotografías estandarizadas pre-tratamiento no tiene baseline. Si aparece o se evidencia una asimetría después del procedimiento, no hay forma de determinar si era preexistente o iatrogénica. Esto tiene implicancias clínicas y medicolegales que no deberían subestimarse.</p>

<h2>La asimetría normal vs. la asimetría relevante</h2>
<p>Estudios anatómicos en adultos sanos muestran que entre el 65 y el 80% de las personas tienen asimetría facial clínicamente detectable. La pregunta no es si existe asimetría, sino si esa asimetría impacta en la estética percibida y si es tratable con los recursos disponibles.</p>

<p>Las asimetrías más relevantes clínicamente son:</p>
<ul>
<li><strong>Asimetría de arcos cigomáticos:</strong> Muy frecuente, genera la percepción de una cara "torcida". Puede mejorar con volumización del malar hipoplásico.</li>
<li><strong>Asimetría de cejas:</strong> La ceja más alta suele ser la dominante. El tratamiento con toxina debe ser cuidadoso: elevar la ceja más baja puede no ser posible o puede crear nuevas asimetrías.</li>
<li><strong>Asimetría mandibular:</strong> Frecuentemente subyace a una mala oclusión. El tratamiento estético puede mejorar la apariencia, pero el origen es ortopédico.</li>
<li><strong>Asimetría de ptosis palpebral:</strong> La ptosis real requiere evaluación oftalmológica antes de cualquier tratamiento periocular.</li>
</ul>

<h2>Error #1: Tratar la asimetría en el lado equivocado</h2>
<p>El error más frecuente y más difícil de reconocer: agregar volumen al lado "deficiente" cuando el lado "excesivo" es el que tiene patología. Un ejemplo clásico es la paciente con hipertrofia unilateral del masetero que parece tener el lado contralateral hipoplásico. Si inyectamos filler en el lado "débil", agravamos la asimetría. El tratamiento correcto es reducir el lado hipertrófico con toxina.</p>

<p>La forma de evitar este error es siempre evaluar ambos lados de forma independiente antes de determinar cuál es el "normal" y cuál el "anormal".</p>

<h2>Error #2: No documentar la asimetría preexistente</h2>
<p>Cuando una paciente llega a la consulta post-tratamiento señalando una asimetría, la conversación es completamente diferente si el médico puede mostrar que esa asimetría existía en las fotos previas. Sin documentación fotográfica estandarizada, el médico está en una posición defensiva muy débil, independientemente de si hizo todo bien.</p>

<p>El protocolo mínimo de fotografía debe incluir: frente en reposo, frente en expresión máxima, perfil derecho, perfil izquierdo, y tres cuartos de cada lado. Las fotos deben tomarse siempre en las mismas condiciones de iluminación y con el mismo fondo.</p>

<h2>Error #3: Prometerle simetría a una cara asimétrica</h2>
<p>La asimetría ósea no puede corregirse con inyectables. Se puede mejorar la percepción de simetría, se pueden compensar asimetrías de tejido blando, pero si la base ósea es asimétrica, el resultado siempre tendrá limitaciones. Comunicar esto con claridad antes del tratamiento es fundamental para manejar las expectativas.</p>

<p>La frase que uso en la consulta es: "Vamos a trabajar para que tu cara se vea más equilibrada, no para que sea perfectamente simétrica — eso no existe". Esa honestidad genera más confianza que prometer un resultado que no puedo garantizar.</p>

<h2>El valor del análisis cuantitativo</h2>
<p>Los sistemas de análisis fotográfico con landmarks faciales están cambiando la forma en que documentamos y comunicamos la asimetría. Poder decirle a una paciente "tu simetría facial mejoró de 78 a 91 puntos entre la sesión anterior y esta" es cualitativamente diferente a decir "se ve mucho mejor". El dato objetivo reduce la subjetividad de la evaluación y da al paciente una referencia concreta de su progreso.</p>

<p>La limitación de estos sistemas, como mencioné, es la sensibilidad a las condiciones fotográficas. Un sistema bien implementado necesita protocolos fotográficos rigurosos para que los datos sean confiables.</p>
`,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getFeaturedPosts(n = 3): BlogPost[] {
  return posts.slice(0, n)
}
