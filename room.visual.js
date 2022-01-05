// function to display cpu usage
// function(cpu) {
//     var cpu_usage = cpu.usage;
//     var cpu_usage_percent = cpu_usage.toFixed(2);
//     var cpu_usage_text = cpu_usage_percent + "%";
//     var cpu_usage_color = "green";
//     if (cpu_usage_percent > 90) {
//         cpu_usage_color = "red";
//     } else if (cpu_usage_percent > 80) {
//         cpu_usage_color = "orange";
//     }
//     var cpu_usage_style = "font-size: 12px; color: " + cpu_usage_color + ";";
//     var cpu_usage_html = "<span style='" + cpu_usage_style + "'>" + cpu_usage_text + "</span>";
//     return cpu_usage_html;
// }