import * as React from "react";
import * as showdown from "showdown";

import { Copy } from "./common/Copy";

interface IProps {
  QueryResult: any;
  Text: string;
  groupBy: string;
  chartType: string;
  chartSorting?: string;
  aggregator?: string[];
  aggregatorColumn?: string[];
  backgroundColorUpstream?: any;
  setChart?(chart: any): void;
  setBgColorUpstream?(bgColor: any): void;
  onDataPointClick?(
    s: any,
    array: any,
    barChartData: any,
    backgroundColor: any,
    _chart: any,
    that: any
  ): void;
}

class ChartSorter {
  public static Ascending(a: any, b: any) {
    return a.age - b.age;
  }

  public static Descending(a: any, b: any) {
    return b.age - a.age;
  }

  public static Alpha(a: any, b: any) {
    return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
  }

  public static sort(
    func: any,
    names: string[],
    counts: number[],
    colors: string[]
  ): void {
    //1) combine the arrays:
    let list = [];
    for (let j = 0; j < names.length; j++) {
      list.push({ name: names[j], age: counts[j], color: colors[j] });
    }

    //2) sort:
    list.sort(func);

    //3) separate them back out:
    for (let k = 0; k < list.length; k++) {
      names[k] = list[k].name;
      counts[k] = list[k].age;
      colors[k] = list[k].color;
    }
  }
}

function randomColorGenerator(): string {
  return "#" + (Math.random().toString(16) + "0000000").slice(2, 8);
}

function getColors(values: string[]): string[] {
  var colors: string[] = [];
  for (var i = 0; i < values.length; i++) {
    var x = values[i];
    var color = "#BBBBBB";
    if (x.length != 0) {
      var c = x[0];
      if (c == "1") {
        color = "#FF0000";
      } // GOP
      else if (c == "2" || c == "R") {
        color = "#880000";
      } else if (c == "3") {
        color = "#880088";
      } // ind
      else if (c == "4" || c == "D") {
        color = "#000088";
      } //
      else if (c == "5") {
        color = "#0000FF";
      } // Dem
    }
    colors.push(color);
  }
  return colors;
}

export function GlobalChart({
  QueryResult,
  Text,
  groupBy,
  chartType,
  chartSorting,
  aggregator,
  aggregatorColumn,
  backgroundColorUpstream,
  setChart,
  setBgColorUpstream,
  onDataPointClick,
}: IProps) {
  const [bgColor, setBgColor] = React.useState(null);
  const chartContainer = React.useRef(null);

  React.useEffect(() => {
    let sortFunc: ChartSorter;

    if (!QueryResult) {
      return;
    }

    const normalizedChartType = chartType === "barGrouped" ? "bar" : chartType;

    if (chartSorting === "asc") {
      sortFunc = ChartSorter.Ascending;
    } else if (chartSorting === "dsc") {
      sortFunc = ChartSorter.Descending;
    } else {
      sortFunc = ChartSorter.Alpha;
    }

    // @ts-ignore
    const parent = $(chartContainer.current);
    parent.empty();

    const values: string[] = QueryResult[groupBy].slice();
    const counts: number[] = [];
    let barChartData: any;

    let backgroundColor: string[] =
      backgroundColorUpstream ||
      (groupBy.indexOf("Party") >= 0 && getColors(QueryResult[groupBy]));

    if (!backgroundColor) {
      backgroundColor = [];
      for (let i = 0; i < values.length; i++) {
        backgroundColor.push(randomColorGenerator());
      }
    } else {
      backgroundColor = backgroundColor.slice(0);
    }

    if (QueryResult[""]) {
      QueryResult[""].forEach((x: any) => {
        counts.push(parseFloat(x));
      });

      let useBg;

      if (!bgColor) {
        setBgColor(backgroundColor);
        if (setBgColorUpstream) {
          setBgColorUpstream(backgroundColor);
        }
        useBg = [...backgroundColor];
      } else {
        useBg = [...bgColor];
      }

      ChartSorter.sort(sortFunc, values, counts, useBg);

      barChartData = {
        labels: values,
        datasets: [
          {
            label: "Results",
            backgroundColor: [...useBg],
            borderColor: "black",
            borderWidth: 1,
            data: counts,
            fill: normalizedChartType !== "line",
          },
        ],
      };
    } else {
      const dataSets = Object.keys(QueryResult)
        .filter((x) => x !== groupBy)
        .map((x, i) => {
          const entry = {
            label: x,
            backgroundColor:
              Object.keys(QueryResult).length > 2
                ? randomColorGenerator()
                : [...backgroundColor],
            borderColor:
              Object.keys(QueryResult).length > 2
                ? randomColorGenerator()
                : [...backgroundColor],
            data: QueryResult[x].map((y: any) => parseFloat(y)),
            fill: normalizedChartType !== "line",
          };
          return entry;
        });

      barChartData = {
        labels: values,
        datasets: dataSets,
      };
    }

    // @ts-ignore
    const canvas = $("<canvas>");
    parent.append(canvas);

    // @ts-ignore
    const _chart = new window.Chart(canvas, {
      type: normalizedChartType,
      data: barChartData,
      options: {
        scales: {
          yAxes: [
            {
              stacked:
                chartType !== "barGrouped" &&
                normalizedChartType !== "line" &&
                !QueryResult[""],
              ticks: {
                beginAtZero: true,
                display:
                  normalizedChartType === "bar" ||
                  normalizedChartType === "line",
              },
              scaleLabel: {
                display:
                  normalizedChartType === "bar" ||
                  normalizedChartType === "line",
                labelString: aggregatorColumn[0]
                  ? `${aggregator[0]} with ${aggregatorColumn[0]}`
                  : "Count",
              },
            },
          ],
          xAxes: [
            {
              stacked:
                chartType !== "barGrouped" &&
                normalizedChartType !== "line" &&
                !QueryResult[""],
              ticks: {
                display:
                  normalizedChartType === "bar" ||
                  normalizedChartType === "line",
              },
              scaleLabel: {
                display:
                  normalizedChartType === "bar" ||
                  normalizedChartType === "line",
                labelString: groupBy,
              },
            },
          ],
        },
        barPercentage: 1,
        responsive: true,
        legend: {
          position: "top",
        },
        title: {
          display: true,
        },
        onClick:
          onDataPointClick &&
          function (s: any, array: any) {
            const that = this;
            onDataPointClick(
              s,
              array,
              barChartData,
              backgroundColor,
              _chart,
              that
            );
          },
      },
    });

    if (setChart) {
      setChart(_chart);
    }
  }, [chartType, chartSorting, QueryResult, groupBy]);

  const converter = new showdown.Converter();

  return (
    <div>
      {Text && (
        <Copy>
          <div dangerouslySetInnerHTML={{ __html: converter.makeHtml(Text) }} />
        </Copy>
      )}
      <div ref={chartContainer} />
    </div>
  );
}
