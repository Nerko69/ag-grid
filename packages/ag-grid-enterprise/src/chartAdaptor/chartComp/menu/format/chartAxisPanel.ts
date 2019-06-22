import { _, AgGroupComponent, Component, PostConstruct, RefSelector, AgInputTextField, AgColorPicker } from "ag-grid-community";
import { ChartController } from "../../chartController";
import { Chart } from "../../../../charts/chart/chart";
import { CartesianChart } from "../../../../charts/chart/cartesianChart";
import {ChartLabelPanel, ChartLabelPanelParams} from "./chartLabelPanel";

export class ChartAxisPanel extends Component {

    public static TEMPLATE =
        `<div>
            <ag-group-component ref="labelAxis">
            
                <ag-input-text-field ref="inputAxisLineWidth"></ag-input-text-field>
                <ag-color-picker ref="inputAxisColor"></ag-color-picker>
    
                <ag-group-component ref="labelAxisTicks">
                    <ag-input-text-field ref="inputAxisTicksWidth"></ag-input-text-field>
                    <ag-input-text-field ref="inputAxisTicksSize"></ag-input-text-field>
                    <ag-input-text-field ref="inputAxisTicksPadding"></ag-input-text-field>
                    <ag-color-picker ref="inputAxisTicksColor"></ag-color-picker>
                </ag-group-component>

                <ag-group-component ref="labelAxisLabelRotation">
                    <span>
                        <ag-input-text-field ref="inputXAxisLabelRotation"></ag-input-text-field>
                        <ag-input-text-field ref="inputYAxisLabelRotation"></ag-input-text-field>                    
                    </span>
                </ag-group-component>
                
            </ag-group-component>            
        </div>`;

    @RefSelector('labelAxis') private labelAxis: AgGroupComponent;
    @RefSelector('inputAxisLineWidth') private inputAxisLineWidth: AgInputTextField;
    @RefSelector('inputAxisColor') private inputAxisColor: AgColorPicker;

    @RefSelector('labelAxisTicks') private labelAxisTicks: AgGroupComponent;
    @RefSelector('inputAxisTicksWidth') private inputAxisTicksWidth: AgInputTextField;
    @RefSelector('inputAxisTicksSize') private inputAxisTicksSize: AgInputTextField;
    @RefSelector('inputAxisTicksPadding') private inputAxisTicksPadding: AgInputTextField;
    @RefSelector('inputAxisTicksColor') private inputAxisTicksColor: AgColorPicker;

    @RefSelector('labelAxisLabelRotation') private labelAxisLabelRotation: AgGroupComponent;
    @RefSelector('inputXAxisLabelRotation') private inputXAxisLabelRotation: AgInputTextField;
    @RefSelector('inputYAxisLabelRotation') private inputYAxisLabelRotation: AgInputTextField;

    private readonly chartController: ChartController;
    private activePanels: Component[] = [];
    private chart: Chart;

    constructor(chartController: ChartController) {
        super();
        this.chartController = chartController;
    }

    @PostConstruct
    private init() {
        this.setTemplate(ChartAxisPanel.TEMPLATE);

        const chartProxy = this.chartController.getChartProxy();
        this.chart = chartProxy.getChart();

        this.initAxis();
        this.initAxisTicks();
        this.initAxisLabels();
    }

    private initAxis() {
        this.labelAxis.setLabel('Axis');

        const chart = this.chart as CartesianChart;
        this.inputAxisLineWidth
            .setLabel('Line Width')
            .setLabelWidth(80)
            .setWidth(115)
            .setValue(`${chart.xAxis.lineWidth}`)
            .onInputChange(newValue => {
                chart.xAxis.lineWidth = newValue;
                chart.yAxis.lineWidth = newValue;
                chart.performLayout();
            });

        this.inputAxisColor.setValue(`${chart.xAxis.lineColor}`);
        this.inputAxisColor.addDestroyableEventListener(this.inputAxisColor, 'valueChange', () => {
            const val = this.inputAxisColor.getValue();
            chart.xAxis.lineColor = val;
            chart.yAxis.lineColor = val;
            this.chart.performLayout();
        });
    }

    private initAxisTicks() {
        this.labelAxisTicks.setLabel('Ticks');

        const chart = this.chart as CartesianChart;

        this.inputAxisTicksWidth
            .setLabel('Width')
            .setLabelWidth(80)
            .setWidth(115)
            .setValue(`${chart.xAxis.lineWidth}`)
            .onInputChange(newValue => {
                chart.xAxis.tickWidth = newValue;
                chart.yAxis.tickWidth = newValue;
                chart.performLayout();
            });

        this.inputAxisTicksSize
            .setLabel('Size')
            .setLabelWidth(80)
            .setWidth(115)
            .setValue(`${chart.xAxis.tickSize}`)
            .onInputChange(newValue => {
                chart.xAxis.tickSize = newValue;
                chart.yAxis.tickSize = newValue;
                chart.performLayout();
            });

        this.inputAxisTicksPadding
            .setLabel('Padding')
            .setLabelWidth(80)
            .setWidth(115)
            .setValue(`${chart.xAxis.tickPadding}`)
            .onInputChange(newValue => {
                chart.xAxis.tickPadding = newValue;
                chart.yAxis.tickPadding = newValue;
                chart.performLayout();
            });

        this.inputAxisTicksColor.setValue(`${chart.xAxis.lineColor}`);

        this.inputAxisTicksColor.addDestroyableEventListener(this.inputAxisTicksColor, 'valueChange', () => {
            const val = this.inputAxisTicksColor.getValue();
            chart.xAxis.tickColor = val;
            chart.yAxis.tickColor = val;
            chart.performLayout();
        });
    }

    private initAxisLabels() {
        const chart = this.chart as CartesianChart;

        const params: ChartLabelPanelParams = {
            chartController: this.chartController,
            getFont: () => chart.xAxis.labelFont,
            setFont: (font: string) => {
                chart.xAxis.labelFont = font;
                chart.yAxis.labelFont = font;
                this.chart.performLayout();
            },
            getColor: () => chart.xAxis.labelColor as string,
            setColor: (color: string) => {
                chart.xAxis.labelColor = color;
                chart.yAxis.labelColor = color;
                this.chart.performLayout();
            }
        };

        const labelPanelComp = new ChartLabelPanel(params);
        this.getContext().wireBean(labelPanelComp);
        this.labelAxis.getGui().appendChild(labelPanelComp.getGui());
        this.activePanels.push(labelPanelComp);

        this.labelAxisLabelRotation.setLabel('Rotation (degrees)');

        this.inputXAxisLabelRotation
            .setLabel('X-Axis')
            .setLabelWidth(30)
            .setWidth(65)
            .setValue(`${chart.xAxis.labelRotation}`)
            .onInputChange(newValue => {
                chart.xAxis.labelRotation = newValue;
                chart.performLayout();
            });

        this.inputYAxisLabelRotation
            .setLabel('Y-Axis')
            .setLabelWidth(30)
            .setWidth(65)
            .setValue(`${chart.yAxis.labelRotation}`)
            .onInputChange(newValue => {
                chart.yAxis.labelRotation = newValue;
                chart.performLayout();
            });
    }

    private destroyActivePanels(): void {
        this.activePanels.forEach(panel => {
            _.removeFromParent(panel.getGui());
            panel.destroy();
        });
    }

    public destroy(): void {
        this.destroyActivePanels();
        super.destroy();
    }
}