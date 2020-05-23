<?php
load_module('accordion', [
  'block_id' => $block_count,
  'title' => get_sub_field('title'),
  'description' => get_sub_field('description'),
  'accordion' => get_sub_field('accordion'),
  'open_first_accordion' => get_sub_field('open_first_accordion')
]);
?>