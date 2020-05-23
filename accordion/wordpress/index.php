<?php
load_module('accordion', [
  'block_id' => 1,
  'title' => get_field('title'),
  'description' => get_field('description'),
  'accordion' => get_field('accordion'),
  'open_first_accordion' => get_field('open_first_accordion')
]);
?>