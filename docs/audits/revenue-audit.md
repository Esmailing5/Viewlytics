# Auditoría del Módulo de Ingresos Estimados (Revenue Audit)

Esta auditoría técnica ha sido realizada para evaluar la fidelidad y la arquitectura de datos del módulo de **Ingresos Estimados** en el Dashboard de Canal de Viewlytics.

---

## 1. Conclusiones de Origen de Datos

*   **¿Usa Mock Data?**
    *   **Sí, parcialmente en el gráfico diario.** La proyección diaria de ingresos de los últimos 14 días se simula matemáticamente en el frontend. Utiliza una fórmula de distribución de vistas basada en videos subidos combinada con un generador determinista de ruido pseudo-aleatorio (`pseudoRandom`) para dar aspecto de variabilidad real.
*   **¿Usa CPM/RPM Calculado?**
    *   **Sí, utiliza valores estáticos estimados.** El módulo calcula rangos basados en estimaciones estándar de RPM (Revenue Per Mille / Ingreso por cada mil vistas) al estilo de plataformas públicas como SocialBlade:
        *   `RPM_LOW` = \$0.25 USD
        *   `RPM_HIGH` = \$4.00 USD
        *   `RPM_AVG` = \$1.50 USD (usado de base para el promedio y el gráfico diario).
*   **¿Usa Snapshots?**
    *   **No.** El componente no consulta históricos de base de datos (`CreatorSnapshot`) ni series temporales para computar los ingresos. Solo toma la métrica agregada de `views_30d` entregada en el objeto `growth` del payload.
*   **¿Usa Valores Hardcodeados?**
    *   **Sí.** Múltiples coeficientes y supuestos de distribución están hardcodeados en el componente:
        *   Rangos de RPM: \$0.25 (mínimo) y \$4.00 (máximo).
        *   Distribución del catálogo histórico: asume que el 50% de las vistas del mes provienen de videos antiguos y las distribuye equitativamente (`(views30d * 0.5) / 30`).
        *   Picos por publicación de videos: asume arbitrariamente que un video obtiene exactamente el 40% de sus reproducciones de por vida el primer día de publicación (`spikeViews * 0.4`).
        *   Ruido aleatorio diario: `(0.85 + pseudoRandom * 0.3)` para variar los ingresos diarios entre el 85% y el 115%.

---

## 2. Fórmulas Utilizadas

### Proyección de Ingresos Acumulados
*   **Ingreso Mensual Mínimo:**
    $$\text{monthlyLow} = \frac{\text{views30d} \times \text{RPM\_LOW}}{1000}$$
*   **Ingreso Mensual Máximo:**
    $$\text{monthlyHigh} = \frac{\text{views30d} \times \text{RPM\_HIGH}}{1000}$$
*   **Ingresos Anuales:**
    $$\text{yearlyLow} = \text{monthlyLow} \times 12$$
    $$\text{yearlyHigh} = \text{monthlyHigh} \times 12$$

### Simulación de Generación Diaria (Gráfico de 14 días)
Por cada día $i$ (desde hace 13 días hasta hoy):
1.  **Vistas base del catálogo (50% de vistas mensuales distribuidas uniformemente):**
    $$\text{baseDailyViews} = \frac{\text{views30d} \times 0.5}{30}$$
    $$\text{baseDailyIncome} = \frac{\text{baseDailyViews} \times \text{RPM\_AVG}}{1000}$$
2.  **Pico de visualizaciones por publicación:**
    $$\text{spikeViews} = \sum (\text{reproducciones de videos subidos en el día } i)$$
    $$\text{spikeIncome} = \frac{(\text{spikeViews} \times 0.4) \times \text{RPM\_AVG}}{1000}$$
3.  **Ruido pseudo-aleatorio determinista:**
    $$\text{pseudoRandom} = \frac{(i \times 17) \pmod{100}}{100}$$
    $$\text{randomNoise} = \text{baseDailyIncome} \times (0.85 + \text{pseudoRandom} \times 0.3)$$
4.  **Ingreso Estimado Total del Día:**
    $$\text{totalEstimated} = \text{randomNoise} + \text{spikeIncome}$$

---

## 3. Precisión Estimada

*   **Precisión: Baja (Aproximación de Caja Negra)**
    *   Al no contar con acceso a la cuenta interna del creador (YouTube Analytics API con credenciales OAuth del propietario), el cálculo es una estimación puramente especulativa. El RPM real de un canal de YouTube puede oscilar drásticamente (desde \$0.10 hasta más de \$15.00 USD) dependiendo de factores geográficos de la audiencia (geografía del CPM), categoría del contenido (finanzas vs. humor), duración del video y densidad de anuncios.

---

## 4. Mejoras Recomendadas

1.  **CPM/RPM por Región y Categoría (Data-Driven RPM):**
    *   En lugar de hardcodear \$0.25 - \$4.00, parametrizar los valores de RPM en la base de datos basándose en el país del canal (`creator.country`) y su categoría temática (`creator.category`). Por ejemplo: un canal de finanzas en EE.UU. tiene un RPM significativamente mayor que un canal de gaming en Latinoamérica.
2.  **Integrar Snapshots de Vistas Diarias:**
    *   Almacenar diariamente la diferencia de vistas entre snapshots en la tabla `CreatorSnapshot`. Con esto, el frontend puede graficar la proyección basada en la cantidad real de reproducciones ganadas por día en los últimos 14 días en lugar de simular la distribución en base al 50% mensual uniforme.
3.  **Soporte OAuth para Creadores Autenticados:**
    *   Habilitar un flujo OAuth para que los creadores vinculen sus cuentas y extraigan métricas reales de monetización (`YouTube Analytics API -> reports`), guardando los ingresos reales y CPMs históricos en base de datos.
