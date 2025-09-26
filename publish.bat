@echo off
setlocal enabledelayedexpansion
chcp 65001

call vsce package

call vsce publish