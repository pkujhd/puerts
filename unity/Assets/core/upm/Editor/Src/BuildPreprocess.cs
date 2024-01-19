using System.Collections.Generic;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;

namespace Puerts
{
    public class BuildPreprocess : IPreprocessBuildWithReport
    {
        public int callbackOrder
        {
            get { return 1; }
        }

        public void OnPreprocessBuild(BuildReport report)
        {
            var pluginFolder = "com.tencent.puerts.core/Plugins";
            var importers = GetPuertsPluginImporters();
            var isDebug = (report.summary.options & BuildOptions.Development) == BuildOptions.Development;
            foreach (var importer in importers)
            {
                var index = importer.assetPath.IndexOf(pluginFolder);
                if (index < 0)
                {
                    continue;
                }
                var splitPath = importer.assetPath.Substring(index + pluginFolder.Length + 1).Split('/');
                var platform = splitPath[0];
                var pluginArch = "";
                var buildtarget = report.summary.platform;
                var cpuValue = "AnyCPU";
                switch (platform)
                {
                    case "Android":
                        if (buildtarget != BuildTarget.Android)
                            continue;
                        pluginArch = splitPath[2];
                        switch (pluginArch)
                        {
                            case "armeabi-v7a":
                                cpuValue = "ARMv7";
                                break;
                            case "arm64-v8a":
                                cpuValue = "ARM64";
                                break;
                            case "x86_64":
                                cpuValue = "X86_64";
                                break;
                        }
                        break;
                    case "iOS":
                        if (buildtarget != BuildTarget.iOS)
                            continue;
                        break;
                    case "x86":
                        if (buildtarget != BuildTarget.StandaloneWindows)
                            continue;
                        break;
                    case "x86_64":
                        if (buildtarget != BuildTarget.StandaloneWindows64)
                            continue;
                        break;
                    case "macOS":
                        if (buildtarget != BuildTarget.StandaloneOSX)
                            continue;
                        break;
                }

                var isDebugPlugin = importer.assetPath.Contains("Debug");
                var isReleasePlugin = importer.assetPath.Contains("Release");
                if(isDebugPlugin || isReleasePlugin)
                {
                    importer.SetPlatformData(buildtarget, "CPU", cpuValue);
                    var active = isDebugPlugin == isDebug;                    
                    importer.SetCompatibleWithPlatform(buildtarget, active);
                    UnityEngine.Debug.Log($"{importer.assetPath} {buildtarget} {cpuValue} {active}");
                }
            }
        }

        private static List<PluginImporter> GetPuertsPluginImporters()
        {
            PluginImporter[] pluginImporters = PluginImporter.GetAllImporters();
            List<PluginImporter> plugins = new List<PluginImporter>();
            foreach (var pluginImporter in pluginImporters)
            {
                if (pluginImporter.assetPath.Contains("puerts"))
                {
                    plugins.Add(pluginImporter);
                }
            }
            return plugins;
        }
    }
}
